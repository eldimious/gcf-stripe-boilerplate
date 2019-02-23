function init(stripeInterface) {
  const createChargeDescription = (campaign) => {
    if (campaign) {
      return `
      \n \n
      Solo campaign: ${campaign.name}
      - Solo advertising: ${campaign.dspBudget} ${campaign.currency}
      - Solo fee: ${campaign.sociusBudget} ${campaign.currency}
      - VAT: ${campaign.vatSum} ${campaign.currency}
      `;
    }
    return undefined;
  };

  const create = async function create(opts) {
    return stripeInterface.charges.create({
      amount: opts.amount,
      currency: opts.currency,
      capture: true,
      receipt_email: opts.customerEmail,
      customer: opts.billingAccountId,
      description: createChargeDescription(opts.campaignDoc),
      metadata: {
        campaignId: opts.campaignId,
      },
    });
  };

  return {
    create,
  };
}

module.exports = init;
