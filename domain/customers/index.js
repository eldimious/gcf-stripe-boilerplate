function init(stripeInterface) {
  const create = async function create(opts) {
    return stripeInterface.customers.create(opts);
  };

  const get = async function get(id) {
    return stripeInterface.customers.create(id);
  };

  const remove = async function remove(id) {
    return stripeInterface.customers.delete(id);
  };

  return {
    create,
    get,
    remove,
  };
}


module.exports = init;
