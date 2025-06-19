// import { inngest } from "./client";
// import { db } from "@/lib/prisma";
// import EmailTemplate from "@/emails/template";
// import { sendEmail } from "@/actions/send-email";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// // 1. Recurring Transaction Processing with Throttling
// export const processRecurringTransaction = inngest.createFunction(
//   {
//     id: "process-recurring-transaction",
//     name: "Process Recurring Transaction",
//     throttle: {
//       limit: 10, // Process 10 transactions
//       period: "1m", // per minute
//       key: "event.data.userId", // Throttle per user
//     },
//   },
//   { event: "transaction.recurring.process" },
//   async ({ event, step }) => {
//     // Validate event data
//     if (!event?.data?.transactionId || !event?.data?.userId) {
//       console.error("Invalid event data:", event);
//       return { error: "Missing required event data" };
//     }

//     await step.run("process-transaction", async () => {
//       const transaction = await db.transaction.findUnique({
//         where: {
//           id: event.data.transactionId,
//           userId: event.data.userId,
//         },
//         include: {
//           account: true,
//         },
//       });

//       if (!transaction || !isTransactionDue(transaction)) return;

//       // Create new transaction and update account balance in a transaction
//       await db.$transaction(async (tx) => {
//         // Create new transaction
//         await tx.transaction.create({
//           data: {
//             type: transaction.type,
//             amount: transaction.amount,
//             description: `${transaction.description} (Recurring)`,
//             date: new Date(),
//             category: transaction.category,
//             userId: transaction.userId,
//             accountId: transaction.accountId,
//             isRecurring: false,
//           },
//         });

//         // Update account balance
//         const balanceChange =
//           transaction.type === "EXPENSE"
//             ? -transaction.amount.toNumber()
//             : transaction.amount.toNumber();

//         await tx.account.update({
//           where: { id: transaction.accountId },
//           data: { balance: { increment: balanceChange } },
//         });

//         // Update last processed date and next recurring date
//         await tx.transaction.update({
//           where: { id: transaction.id },
//           data: {
//             lastProcessed: new Date(),
//             nextRecurringDate: calculateNextRecurringDate(
//               new Date(),
//               transaction.recurringInterval
//             ),
//           },
//         });
//       });
//     });
//   }
// );

// // Trigger recurring transactions with batching
// export const triggerRecurringTransactions = inngest.createFunction(
//   {
//     id: "trigger-recurring-transactions", // Unique ID,
//     name: "Trigger Recurring Transactions",
//   },
//   { cron: "0 0 * * *" }, // Daily at midnight
//   async ({ step }) => {
//     const recurringTransactions = await step.run(
//       "fetch-recurring-transactions",
//       async () => {
//         return await db.transaction.findMany({
//           where: {
//             isRecurring: true,
//             status: "COMPLETED",
//             OR: [
//               { lastProcessed: null },
//               {
//                 nextRecurringDate: {
//                   lte: new Date(),
//                 },
//               },
//             ],
//           },
//         });
//       }
//     );

//     // Send event for each recurring transaction in batches
//     if (recurringTransactions.length > 0) {
//       const events = recurringTransactions.map((transaction) => ({
//         name: "transaction.recurring.process",
//         data: {
//           transactionId: transaction.id,
//           userId: transaction.userId,
//         },
//       }));

//       // Send events directly using inngest.send()
//       await inngest.send(events);
//     }

//     return { triggered: recurringTransactions.length };
//   }
// );

// // 2. Monthly Report Generation
// async function generateFinancialInsights(stats, month) {
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = `
//     Analyze this financial data and provide 3 concise, actionable insights.
//     Focus on spending patterns and practical advice.
//     Keep it friendly and conversational.

//     Financial Data for ${month}:
//     - Total Income: $${stats.totalIncome}
//     - Total Expenses: $${stats.totalExpenses}
//     - Net Income: $${stats.totalIncome - stats.totalExpenses}
//     - Expense Categories: ${Object.entries(stats.byCategory)
//       .map(([category, amount]) => `${category}: $${amount}`)
//       .join(", ")}

//     Format the response as a JSON array of strings, like this:
//     ["insight 1", "insight 2", "insight 3"]
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

//     return JSON.parse(cleanedText);
//   } catch (error) {
//     console.error("Error generating insights:", error);
//     return [
//       "Your highest expense category this month might need attention.",
//       "Consider setting up a budget for better financial management.",
//       "Track your recurring expenses to identify potential savings.",
//     ];
//   }
// }

// export const generateMonthlyReports = inngest.createFunction(
//   {
//     id: "generate-monthly-reports",
//     name: "Generate Monthly Reports",
//   },
//   { cron: "0 0 1 * *" }, // First day of each month
//   async ({ step }) => {
//     const users = await step.run("fetch-users", async () => {
//       return await db.user.findMany({
//         include: { accounts: true },
//       });
//     });

//     for (const user of users) {
//       await step.run(`generate-report-${user.id}`, async () => {
//         const lastMonth = new Date();
//         lastMonth.setMonth(lastMonth.getMonth() - 1);

//         const stats = await getMonthlyStats(user.id, lastMonth);
//         const monthName = lastMonth.toLocaleString("default", {
//           month: "long",
//         });

//         // Generate AI insights
//         const insights = await generateFinancialInsights(stats, monthName);

//         await sendEmail({
//           to: user.email,
//           subject: `Your Monthly Financial Report - ${monthName}`,
//           react: EmailTemplate({
//             userName: user.name,
//             type: "monthly-report",
//             data: {
//               stats,
//               month: monthName,
//               insights,
//             },
//           }),
//         });
//       });
//     }

//     return { processed: users.length };
//   }
// );

// // 3. Budget Alerts with Event Batching
// export const checkBudgetAlerts = inngest.createFunction(
//   { name: "Check Budget Alerts" },
//   { cron: "0 */6 * * *" }, // Every 6 hours
//   async ({ step }) => {
//     const budgets = await step.run("fetch-budgets", async () => {
//       return await db.budget.findMany({
//         include: {
//           user: {
//             include: {
//               accounts: {
//                 where: {
//                   isDefault: true,
//                 },
//               },
//             },
//           },
//         },
//       });
//     });

//     for (const budget of budgets) {
//       const defaultAccount = budget.user.accounts[0];
//       if (!defaultAccount) continue; // Skip if no default account

//       await step.run(`check-budget-${budget.id}`, async () => {
//         const startDate = new Date();
//         startDate.setDate(1); // Start of current month

//         // Calculate total expenses for the default account only
//         const expenses = await db.transaction.aggregate({
//           where: {
//             userId: budget.userId,
//             accountId: defaultAccount.id, // Only consider default account
//             type: "EXPENSE",
//             date: {
//               gte: startDate,
//             },
//           },
//           _sum: {
//             amount: true,
//           },
//         });

//         const totalExpenses = expenses._sum.amount?.toNumber() || 0;
//         const budgetAmount = budget.amount;
//         const percentageUsed = (totalExpenses / budgetAmount) * 100;

//         // Check if we should send an alert
//         if (
//           percentageUsed >= 80 && // Default threshold of 80%
//           (!budget.lastAlertSent ||
//             isNewMonth(new Date(budget.lastAlertSent), new Date()))
//         ) {
//           await sendEmail({
//             to: budget.user.email,
//             subject: `Budget Alert for ${defaultAccount.name}`,
//             react: EmailTemplate({
//               userName: budget.user.name,
//               type: "budget-alert",
//               data: {
//                 percentageUsed,
//                 budgetAmount: parseInt(budgetAmount).toFixed(1),
//                 totalExpenses: parseInt(totalExpenses).toFixed(1),
//                 accountName: defaultAccount.name,
//               },
//             }),
//           });

//           // Update last alert sent
//           await db.budget.update({
//             where: { id: budget.id },
//             data: { lastAlertSent: new Date() },
//           });
//         }
//       });
//     }
//   }
// );

// function isNewMonth(lastAlertDate, currentDate) {
//   return (
//     lastAlertDate.getMonth() !== currentDate.getMonth() ||
//     lastAlertDate.getFullYear() !== currentDate.getFullYear()
//   );
// }

// // Utility functions
// function isTransactionDue(transaction) {
//   // If no lastProcessed date, transaction is due
//   if (!transaction.lastProcessed) return true;

//   const today = new Date();
//   const nextDue = new Date(transaction.nextRecurringDate);

//   // Compare with nextDue date
//   return nextDue <= today;
// }

// function calculateNextRecurringDate(date, interval) {
//   const next = new Date(date);
//   switch (interval) {
//     case "DAILY":
//       next.setDate(next.getDate() + 1);
//       break;
//     case "WEEKLY":
//       next.setDate(next.getDate() + 7);
//       break;
//     case "MONTHLY":
//       next.setMonth(next.getMonth() + 1);
//       break;
//     case "YEARLY":
//       next.setFullYear(next.getFullYear() + 1);
//       break;
//   }
//   return next;
// }

// async function getMonthlyStats(userId, month) {
//   const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
//   const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

//   const transactions = await db.transaction.findMany({
//     where: {
//       userId,
//       date: {
//         gte: startDate,
//         lte: endDate,
//       },
//     },
//   });

//   return transactions.reduce(
//     (stats, t) => {
//       const amount = t.amount.toNumber();
//       if (t.type === "EXPENSE") {
//         stats.totalExpenses += amount;
//         stats.byCategory[t.category] =
//           (stats.byCategory[t.category] || 0) + amount;
//       } else {
//         stats.totalIncome += amount;
//       }
//       return stats;
//     },
//     {
//       totalExpenses: 0,
//       totalIncome: 0,
//       byCategory: {},
//       transactionCount: transactions.length,
//     }
//   );
// }



import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmail } from "@/actions/send-email";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Recurring Transaction Processing with Throttling
export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10, // Process 10 transactions
      period: "1m", // per minute
      key: "event.data.userId", // Throttle per user
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    // Validate event data
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId,
        },
        include: {
          account: true,
        },
      });

      if (!transaction || !isTransactionDue(transaction)) return;

      // Create new transaction and update account balance in a transaction
      await db.$transaction(async (tx) => {
        // Create new transaction
        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false,
          },
        });

        // Update account balance
        const balanceChange =
          transaction.type === "EXPENSE"
            ? -transaction.amount.toNumber()
            : transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } },
        });

        // Update last processed date and next recurring date
        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            ),
          },
        });
      });
    });
  }
);

// Trigger recurring transactions with batching
export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" }, // Daily at midnight
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
              { lastProcessed: null },
              {
                nextRecurringDate: {
                  lte: new Date(),
                },
              },
            ],
          },
        });
      }
    );

    // Send event for each recurring transaction in batches
    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId,
        },
      }));

      // Send events directly using inngest.send()
      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);

// 2. Monthly Report Generation
async function generateFinancialInsights(stats, month) {
  console.log("Generating financial insights for month:", month);
  console.log("Stats:", stats);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);

  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing, using fallback insights");
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: $${stats.totalIncome}
    - Total Expenses: $${stats.totalExpenses}
    - Net Income: $${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory)
      .map(([category, amount]) => `${category}: $${amount}`)
      .join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    console.log("Gemini API response:", cleanedText);

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
      "Your highest expense category this month might need attention.",
      "Consider setting up a budget for better financial management.",
      "Track your recurring expenses to identify potential savings.",
    ];
  }
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" }, // First day of each month
  async ({ step }) => {
    const user = {
      id: "test-user-id",
      email: "anshikashekhar13@gmail.com", // Replace with your real email, e.g., myrealemail@gmail.com
      name: "Test User",
    };

    await step.run(`generate-report-${user.id}`, async () => {
      const monthName = "May"; // Since today is June 12, 2025, use May
      const stats = {
        totalIncome: 2000.00, // Example income
        totalExpenses: 1301.60,
        byCategory: {
          Personal: 1000.00,
          Food: 200.00,
          Shopping: 101.60,
        },
        transactionCount: 3,
      };

      const insights = [
        "You’ve spent a lot on Personal expenses—maybe try cutting back a bit next month!",
        "Your Food spending is moderate; cooking at home more could save you some cash.",
        "Shopping expenses are low—great job keeping that in check!",
      ];

      try {
        const emailResponse = await sendEmail({
          to: user.email,
          subject: `Your Monthly Financial Report - ${monthName}`,
          react: EmailTemplate({
            userName: user.name,
            type: "monthly-report",
            data: {
              stats,
              month: monthName,
              insights,
            },
          }),
        });

        if (!emailResponse || !emailResponse.success) {
          throw new Error(
            `Failed to send email: ${emailResponse?.error || "Unknown error"}`
          );
        }
      } catch (error) {
        console.error("Email sending failed in generateMonthlyReports:", error);
        throw error; // Re-throw to fail the Inngest step
      }
    });

    return { processed: 1 };
  }
);

// Comment out the original dynamic version to revert once email works
/*
export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports",
  },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long",
        });

        // Generate AI insights
        const insights = await generateFinancialInsights(stats, monthName);

        try {
          const emailResponse = await sendEmail({
            to: user.email,
            subject: `Your Monthly Financial Report - ${monthName}`,
            react: EmailTemplate({
              userName: user.name,
              type: "monthly-report",
              data: {
                stats,
                month: monthName,
                insights,
              },
            }),
          });

          if (!emailResponse || !emailResponse.success) {
            throw new Error(
              `Failed to send email: ${emailResponse?.error || "Unknown error"}`
            );
          }
        } catch (error) {
          console.error("Email sending failed in generateMonthlyReports:", error);
          throw error; // Re-throw to fail the Inngest step
        }
      });
    }

    return { processed: users.length };
  }
);
*/

// 3. Budget Alerts with Event Batching
export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // Every 6 hours
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccount = budget.user.accounts[0];
      if (!defaultAccount) continue; // Skip if no default account

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1); // Start of current month

        // Calculate total expenses for the default account only
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id, // Only consider default account
            type: "EXPENSE",
            date: {
              gte: startDate,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        // Check if we should send an alert
        if (
          percentageUsed >= 80 && // Default threshold of 80%
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed,
                budgetAmount: parseInt(budgetAmount).toFixed(1),
                totalExpenses: parseInt(totalExpenses).toFixed(1),
                accountName: defaultAccount.name,
              },
            }),
          });

          // Update last alert sent
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      });
    }
  }
);

// Utility functions
function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

function isTransactionDue(transaction) {
  // If no lastProcessed date, transaction is due
  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);

  // Compare with nextDue date
  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

async function getMonthlyStats(userId, month) {
  console.log("Fetching monthly stats for user:", userId, "Month:", month);

  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  console.log("Date range:", startDate, "to", endDate);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  console.log("Transactions:", transactions);

  const stats = transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
          (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length,
    }
  );
  console.log("Computed stats:", stats);

  return stats;
}