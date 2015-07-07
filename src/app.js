var React = require('react/addons');
var TodoStrage = require('./strage.js');
var Router = require('director').Router;

var todoList = [
    {id:'_1',name:'Buy some milk',done:true},
    {id:'_2',name:'Birthday present for alice',done:false}
];

var Todo = React.createClass({
   render: function(){
       var todo = this.props.todo;
       return(
           <li>
               {todo.name}<button>Done</button>
           </li>
       );
   }
});

var TodoList = React.createClass({
    render: function(){
        var rows = this.props.todos.filter(function(todo){
            return !todo.done;
        }).map(function(todo){
            return (
                <Todo key={todo.id} todo={todo}></Todo>
            );
        });
        return(
            <div className="active-todos">
                <h2>Active</h2>
                <ul>
                    {rows}
                </ul>
            </div>
        );
    }
});

var App = React.createClass({
    getInitialState : function(){
      return{
          todos:[]
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
           <TodoList todos={this.state.todos}></TodoList>:
           <div>completed todos here</div>

       return (
           <div>
               <h1>My Todo</h1>
               <ul>
                   <li><a href="#/active">Active</a></li>
                   <li><a href="#/completed">Completed</a></li>
               </ul>
               {page}
           </div>
       );
   }
});

var TodoForm = React.createClass({
    render:function(){
        var disabled = this.state.name.trim().length <=0;
        return (
            <form onSubmit={this.handleSubmit}>
                <input value={this.state.name} onChange={handleNameChange} ></input>
                <input type="submit" disabled={disabled}></input>
            </form>
        );
    },
    getInitialState : function(){
        return {name:''};
    },
    handleNameChange : function(e){
        this.setState({
            name: e.target.value
        });
    },
    handleSubmit : function(){
        e.preventDefault();
        var name = this.state.name.trim();
        TodoStrage.create(name,function(){
            this.setState({
                name: ''
            });
        }.bind(this));
    }
})

React.render(
    <App></App>,
    document.getElementById('app-container')
);