

function sleep(ms) {
  return new Promise(resolve => setTimeout(()=> resolve(), ms));
}

function retryWrapper(asyncFunc, times) {
  return async function () {
    for (let i = 0; i < times; i++) {
      try {
        return await asyncFunc.apply(null, arguments);
      } catch (e) {
        if (i === times - 1) {
          throw(e);
        }
        console.log('忽略一次')
      }
    }
  }
}

function onlyOneWrapper(asyncFunc) {
  let running = false;
  return async function () {
    if (running) return false;
    running = true;
    const ret = await asyncFunc.apply(null, arguments);
    running = false;
    return ret;
  }
}

module.exports = {
  sleep,
  retryWrapper,
  onlyOneWrapper
};

if (!module.parent) {
  async function foo (a ) {
    await sleep(1000);
    return a
  }

  foo = onlyOneWrapper(foo)

  async function test() {
    foo(123).then(ret => console.log('ret', ret))
    foo(123).then(ret => console.log('ret', ret))
    foo(123).then(ret => console.log('ret', ret))
    foo(123).then(ret => console.log('ret', ret))

  }
  test();
}
