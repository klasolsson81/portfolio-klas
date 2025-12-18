import { config } from '../lib/config/env.js';

/**
 * GitHub Contributions API Endpoint
 * Fetches contribution calendar data using GitHub GraphQL API
 */
export default async function handler(req, res) {
  // Only GET allowed
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const username = 'klasolsson81';

    // Calculate date range (last 6 months)
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 6);

    // Format dates for GraphQL (ISO 8601)
    const fromDate = from.toISOString();
    const toDate = to.toISOString();

    // GitHub GraphQL query
    const query = `
      query($userName: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $userName) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    // Fetch from GitHub GraphQL API
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GITHUB_TOKEN || config.githubToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          userName: username,
          from: fromDate,
          to: toDate,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // Check for GraphQL errors
    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error('GraphQL query failed');
    }

    // Check for valid response structure
    if (!data.data || !data.data.user) {
      console.error('Invalid GraphQL response structure:', JSON.stringify(data, null, 2));
      throw new Error('Invalid response from GitHub GraphQL API');
    }

    // Extract contribution data
    const contributionCalendar = data.data.user.contributionsCollection.contributionCalendar;

    // Log summary for debugging
    console.log('GitHub contributions fetched:', {
      totalContributions: contributionCalendar.totalContributions,
      weeksCount: contributionCalendar.weeks.length,
      dateRange: { from: fromDate, to: toDate }
    });

    // Flatten weeks into days array
    const contributions = [];
    contributionCalendar.weeks.forEach(week => {
      week.contributionDays.forEach(day => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          color: day.color,
        });
      });
    });

    console.log('Processed contributions:', {
      daysCount: contributions.length,
      nonZeroDays: contributions.filter(d => d.count > 0).length
    });

    // Return data
    return res.status(200).json({
      contributions,
      totalContributions: contributionCalendar.totalContributions,
    });

  } catch (error) {
    console.error('GitHub contributions API error:', error);
    return res.status(500).json({
      error: 'Failed to fetch GitHub contributions',
      message: error.message,
    });
  }
}
