const fetch = require('node-fetch');

exports.handler = async (event) => {
  const { responses } = JSON.parse(event.body);

  const result = await fetch(process.env.HASURA_URL, {
    method: 'POST',
    headers: {
      'X-Hasura-Admin-Secret': process.env.HASURA_ADMIN_SECRET,
    },
    body: JSON.stringify({
      query: `
        mutation AddTacoVotes($objects: [tacoVotes_insert_input!]!) {
          insert_tacoVotes(objects: $objects) {
            affected_rows
          }
        }
      
      `,
      variables: {
        objects: responses,
      },
    }),
  }).then((res) => res.json());

  if (!result || !result.data) {
    console.error(result);
    return [];
  }

  return {
    statusCode: 200,
    body: 'ok',
  };
};
