# ctjs-di
A small dependency injection library that works in the browser or in Node

## Getting Started
Install ctjs-di
```
npm install --save ctjs-di
```

Create a context and register classes or objects. Finally call initialize to construct registered classes and wire their dependencies.
```javascript
import {Di} from 'ctjs-di';

let context = Di.createContext();
context.register('Name', SomeClass);
context.register('Name', SomeClass, ['SomeClass Constructor Arguments']);
context.register('Name').object(ObjectInstance);

context.initialize();
```
You can get a reference to an instance by calling get('Name');
```javascript
import {Di} from 'ctjs-di';

let context = Di.createContext();
context.register('Name', SomeClass);
context.initialize();

let someClassInstance = context.get('Name');
```

### Who do I talk to?
chrisjasp@gmail.com