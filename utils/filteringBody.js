const filterBody = (obj, ...allowed) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowed.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export { filterBody };
