var React = require('react/addons');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var generateId = (function() {
    var id = 0;
    return function() {
        return '_' + id++;
    }
})();

var todos = [{
    id: generateId(),
    name: 'Buy some milk',
    status: 0
}, {
    id: generateId(),
    name: 'Birthday present to Alice',
    status: 0
}];

var TodoStorage = assign({}, EventEmitter.prototype, {
    getAll: function(callback) {
        callback(todos);
    },
    complete: function(id) {
        for(var i = 0; i < todos.length; i++) {
            var todo = todos[i];
            if(todo.id === id) {
                var newTodo = React.addons.update(todo, {status: {$set: 1}});
                todos = React.addons.update(todos, {$splice: [[i, 1, newTodo]]});
                this.emit('change');
                break;
            }
        }
    },
    create: function(name, callback) {
        var newTodo = {
            id: generateId(),
            name: name,
            status: 0
        };
        todos = React.addons.update(todos, {$push: [newTodo]});
        this.emit('change');
        callback();
    }
});

module.exports = TodoStorage;