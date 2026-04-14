const calculateAmount = (data) => {
  const materialTotal = data.materials.reduce((sum, row) => {
    const pic = Number(row.pic) || 0;
    const qty = Number(row.qty) || 0;

    return sum + pic * qty;
  }, 0);

  const bending = Number(data.bending) || 0;
  const add = Number(data.add) || 0;

  return materialTotal + bending + add;
};

export default calculateAmount