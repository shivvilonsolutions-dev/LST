const calculateAmount = (formData) => {
  const categories = [
    ...new Set(
      formData.materials
        .map((m) => m.category)
        .filter(Boolean)
    ),
  ];

  const cat1 = categories[0];
  const cat2 = categories[1];

  let sum1 = 0;
  let sum2 = 0;

  formData.materials.forEach((m) => {
    const value = Number(m.pic || 0);

    if (m.category === cat1) sum1 += value;
    else if (m.category === cat2) sum2 += value;
  });

  return (
    sum1 * Number(formData.rateB1 || 0) +
    sum2 * Number(formData.rateB2 || 0)
  );
};

export default calculateAmount