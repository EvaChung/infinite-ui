const noop = () => {};

function api(cb = noop) {
    return new Promise((resolve, reject) => {
        const value = 'foobar'
        resolve(value);
        cb(null, value);
    })
}


api((err, data) => {
    if (err) {
        return console.error(err)
    }
})

api().then(value => {}).catch(err => console.errog(err))


const obj = {
    msg: 'hello world',
    foo(message = this.msg) {
        console.log(arguments)
    }
}


function sum(...numbers) {
    return numbers.reduce((a, b) => a + b)
}

sum(...[1, 2, 3])

const set = new Set([1, 2, 3, 4]);


class Animal {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    static extend(constructor,..._args){
        return class extends Animal{
            constructor(...args){
                super(..._args)
                constructor.call(this,...args)
            }
        }
    }
}



class Point2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    toString() {
        return `(${this.x},${this.y})`;
    }
}

Point2D.prototype.valueOf = function(argument) {
    return this.valueOf()
};

class Point3D extends Point2D {
    constructor(){
        super();
        this.x = 1;
    }
    abc(){
        return 'Aho'
    }
}

class Layer{
    constructor(selector,config){
        this.el = selector;
        this.config = config;
    }
    init(){
        this.createTemplate();
    }
    createTemplate(){
        var str = '<div>hello world</div>';
    }
    static destroy(constructor,..._args){
        delete this;
    }
}


class Dialog extends Layer {
    constructor(){
        // 此处需要非常注意的是，
        // 如果子类继承父类，那么在子类的constructor中必须使用 super 函数
        // 才能够在子类的constructor中使用this，否则会报错
        super(arguments);
        this.width = 100;
        this.height = 200;
    }
    show(){
        this.style.display = 'block';
    }
    hide(){
        this.style.display = 'none';
    }
}