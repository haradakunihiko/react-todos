var React = require('react/addons');
var TodoStrage = require('./strage.js');
var Router = require('director').Router;

var todoList = [
    {id:'_1',name:'Buy some milk',status:0},
    {id:'_2',name:'Birthday present for alice',status:0}
];

var Todo = React.createClass({
    handleClick:function(){
        TodoStrage.complete(this.props.todo.id);
    },
   render: function(){
       var todo = this.props.todo;
       var button = this.props.todo.status ===0?
           <button onClick={this.handleClick}>Done</button>:
           '';
       return(
           <li>
               {todo.name}{button}
           </li>
       );
   }
});
var TodoList = React.createClass({
    render: function(){
        var rows = this.props.todos.filter(function(todo){
            return todo.status == this.props.status;
        }.bind(this)).map(function(todo){
            return (
                <Todo key={todo.id} todo={todo}></Todo>
            );
        });
        var title  = this.props.status === 0 ? 'Active' : 'Completed';
        return(
            <div className="active-todos">
                <h2>{title}</h2>
                <ul>
                    {rows}
                </ul>
            </div>
        );
    }
});

var TodoForm = React.createClass({
    handleNameChange : function(e){
        this.setState({
            name: e.target.value
        });
    },
    handleSubmit : function(e){
        e.preventDefault();
        var name = this.state.name.trim();
        TodoStrage.create(name,function(){
            this.setState({
                name: ''
            });
        }.bind(this));
    },
    render:function(){
        var disabled = this.state.name.trim().length <=0;
        return (
            <form onSubmit={this.handleSubmit}>
                <input value={this.state.name} onChange={this.handleNameChange} ></input>
                <input type="submit" disabled={disabled}></input>
            </form>
        );
    },
    getInitialState : function(){
        return {name:''};
    }
});
var App = React.createClass({
    getInitialState : function(){
      return{
          todos:[],
          page:'active'
      }
    },
    componentDidMount : function () {
        var setTodos = function () {
            TodoStrage.getAll(function (todos) {
                this.setState({todos:todos});
            }.bind(this))
        }.bind(this);
        TodoStrage.on('change',setTodos);
        setTodos();

        var setActivePage = function(){
            this.setState({page :'active'});
        }.bind(this);
        var setCompletedPage = function(){
            this.setState({page:'completed'});
        }.bind(this);
        var router = Router({
            '/active':setActivePage,
            '/completed':setCompletedPage,
            '*':setActivePage
        });
        router.init();
    },
   render: function () {
       var page = this.state.page ==='active' ?
           <TodoList todos={this.state.todos} status={0}></TodoList>:
           <TodoList todos={this.state.todos} status={1}></TodoList>;
        var activeCount = this.state.todos.filter(function(todo){return todo.status === 0}).length;
       var completedCount = this.state.todos.length - activeCount;
       return (
           <div>
               <h1>My Todo</h1>
               <ul>
                   <li><a href="#/active">Active({activeCount})</a></li>
                   <li><a href="#/completed">Completed({completedCount})</a></li>
               </ul>
               {page}
               <TodoForm></TodoForm>
           </div>
       );
   }
});



React.render(
    <App></App>,
    document.getElementById('app-container')
);