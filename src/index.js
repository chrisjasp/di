export class Context {
  constructor() {
    this._map = {};
  }

  entry(name) {
    return this._map[name];
  }

  register(name, type, args) {
    let entry = new ContextEntry(name, this)
        .type(type)
        .args(args);
    this._map[name] = entry;
    return entry;
  }

  has(name) {
    return this.entry(name) != null;
  }

  get(name) {
    if (this.has(name)) {
      return this.entry(name).object();
    } else {
      throw Error(`Object[${name}] is not registerd`);
    }
  }

  create(name, args) {
    if (this.entry(name).strategy() != Strategy.proto) {
      throw Error('Attempt to create singleton object');
    }

    if (this.has(name)) {
      return this.entry(name).create(args);
    } else {
      throw Error(`Object[${name}] is not registered`);
    }
  }

  initialize() {
    for (let name in this._map) {
      let entry = this.entry(name);
      this.ready(this.inject(name, this.get(name), entry.dependencies()));
    }
  }

  clear() {
    this._map = {};
  }

  removeSpaces(s) {
    while (s.indexOf(' ') >= 0) s = s.replace(' ', '');
    return s;
  }

  inject(name, o, dependencies) {
    dependencies = dependencies ? dependencies : o.dependencies;
    if (o && dependencies) {
        let depExpList = this.removeSpaces(dependencies).split(',');
        depExpList.forEach((depExp) => {
            if (depExp) {
              let exp = new DependencyExpression(depExp);
              let dep = this.get(exp.name);
              if (dep == null) {
                throw Error('Dependency [' + name + '.' + exp.property + ']->[' + exp.name + '] can not be satisfied');
              }
              o[exp.property] = dep;
            }
        });
    }
    return o;
  }

  ready(o) {
    if (typeof o.ready === 'function') {
      o.ready();
    }
    return o;
  }
}

class ContextEntry {
  constructor(name, ctx) {
    this._name = name;
    this._ctx = ctx;
    this._strategy = Strategy.singleton;
    this._factory = this.__factory;
  }

  create(newArgs) {
    return this._strategy(this._name, this._object, this._factory, this._type, newArgs ? newArgs : this._args, this._ctx, this._dependencies);
  }

  object(o) {
    if (!arguments.length) {
      this._object = this.create();
      return this._object;
    } else {
      this._object = o;
      return this;
    }
  }

  strategy(s) {
    if (!arguments.length) {
      return this._strategy;
    }
    this._strategy = s;
    return this;
  }

  type(t) {
    if (!arguments.length) {
      return this._type;
    }
    this._type = t;
    return this;
  }

  dependencies(d) {
    if (!arguments.length) {
      return this._dependencies;
    }
    this._dependencies = d;
    return this;
  }

  args(a) {
    if (!arguments.length) {
      return this._args;
    }
    this._args = a;
    return this;
  }

  factory(f) {
    if (!arguments.length) {
      return this._factory;
    }
    this._factory = f;
    return this;
  }

  __factory(type, args) {
    if (args instanceof Array) {
      return eval(DiUtils.invokeStmt(args, 'new')); // eslint-disable-line no-eval
    } else {
      return new type(args); // eslint-disable-line new-cap
    }
  }
}

class Strategy {
  static proto(name, object, factory, type, args, ctx, dependencies) {
    object = factory(type, args);
    return ctx.ready(ctx.inject(name, object, dependencies));
  }

  static singleton(name, object, factory, type, args, ctx, dependencies) {
    if (!object) {
      object = factory(type, args);
    }
    return object;
  }
}

class DiUtils {
  static invokeStmt(args, op) {
    let exp = op ? op : '';
    exp += ' type(';
    let i = 0;
    for (; i < args.length; ++i) {
      exp += `args[${i}],`;
    }
    if (i > 0) {
      exp = exp.slice(0, exp.length - 1);
    }
    exp += ')';
    return exp;
  }
}

class DependencyExpression {
  constructor(depExp) {
    let property = depExp;
    let name = depExp;
    if (depExp.indexOf('=') > 0) {
        let depExpParts = depExp.split('=');
        property = depExpParts[0];
        name = depExpParts[1];
    }
    this.name = name;
    this.property = property;
  }
}

export class Di {
  static get version() {
    return '1.0.0';
  }

  static createContext() {
    return new Context();
  }
}
