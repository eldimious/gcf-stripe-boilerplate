function init(stripeInterface) {
  const create = async function create(opts) {
    return stripeInterface.charges.create(opts);
  };

  return {
    create,
  };
}


module.exports.init = init;
