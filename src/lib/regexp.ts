const _digitRegexp = new RegExp(/(\d+)/);

export const digitMatcher = (text: string) => {
  const matches = text.match(_digitRegexp)
  if (matches && matches.length && matches[1]) {
    return matches[1]
  }
};
