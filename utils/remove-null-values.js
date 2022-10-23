import cloneDeep from '@modules/lodash.clonedeep';

export default (value) => {
  const copyValue = cloneDeep(value);

  Object.keys(copyValue).forEach((key) => {
    if (copyValue[key] === null || Boolean(copyValue[key]) === false) {
      delete copyValue[key];
    }
  });

  return copyValue;
};
