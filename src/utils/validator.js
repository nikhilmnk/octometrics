export const validateUsername = (username) => {
  return typeof username === 'string' && /^[a-zA-Z0-9_-]{1,39}$/.test(username);
};

export const validateRepo = (repo) => {
  return (
    typeof repo === 'string' && /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/.test(repo)
  );
};
