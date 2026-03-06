import dotenv from 'dotenv';
dotenv.config();

const q = `query($u: String!, $f: DateTime, $t: DateTime) {
  user(login: $u) {
    contributionsCollection(from: $f, to: $t) {
      contributionCalendar { totalContributions }
    }
  }
}`;

const test = async () => {
  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + process.env.GITHUB_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: q,
      variables: {
        u: 'nikhilmnk',
        f: '2023-01-01T00:00:00Z',
        t: '2023-12-31T23:59:59Z',
      },
    }),
  });
  const data = await r.json();
  console.log('2023 count:', JSON.stringify(data));
};
test();
