import React from 'react'
import { getData } from '../../../utils/localStorage';

const quotationData = getData("quotations")

const FetchQuotationData = () => {
  console.log(quotationData)
  return quotationData;
}

export default FetchQuotationData

