function generatorToPromise (makeGenerator) {
  return function () {
    var generator = makeGenerator.apply(this, arguments);

    function handle(result){
      if (result.done) {
        return Promise.resolve(result.value);
      }

      return Promise.resolve(result.value).then((res) => {
        return handle(generator.next(res));
    }, (err) => {
        return handle(generator.throw(err));
      });
    }

    try {
      return handle(generator.next());
    } catch (ex) {
      return Promise.reject(ex);
    }
  };
}

module.exports = generatorToPromise;
