var React = require('react/addons');
var TodoStrage = require('./strage.js');
var Router = require('director').Router;
var Perf = React.addons.Perf;

var Todo = React.createClass({
    shouldComponentUpdate : function(nextProps,nextState){
        return this.props.todo.name !== nextProps.todo.name ||
            this.props.todo.status !== nextProps.todo.status;
    },
    handleClick:function(){
        TodoStrage.complete(this.props.todo.id);
    },
   render: function(){
       var button = this.props.todo.status === 0?
           <button className="btn btn-default pull-right" onClick={this.handleClick}>
            <span className="glyphicon glyphicon-ok text-success"></span>
           </button>:
           null;
       return(
           <li className="list-group-item clearfix">
               {this.props.todo.name}
               {button}
           </li>
       );
   }
});
var TodoList = React.createClass({
    render: function(){
        var rows = this.props.todos.map(function(todo){
            return (
                <Todo key={todo.id} todo={todo}></Todo>
            );
        });

        return(
            <div>
                <ul className="list-group">
                    {rows}
                </ul>
            </div>
        );
    }
});

var TodoForm = React.createClass({
    shouldComponentUpdate:function(nextProps,nextState){
        return this.state.name !== nextState.name;
    },
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
                <div className="input-group">
                    <input className="form-control" value={this.state.name} onChange={this.handleNameChange} placeholder="input your todo!"></input>
                    <span className="input-group-btn">
                        <input type="submit" className="btn btn-default" disabled={disabled}></input>
                    </span>
                </div>
            </form>
        );
    },
    getInitialState : function(){
        return {name:''};
    }
});

var Page =React.createClass({
    render: function () {
        var rows = this.props.todos.filter(function(todo){
            return todo.status == this.props.pageStatus;
        }.bind(this));
        return (
            <div className="container">
                <div className="page-header">
                    <h1>My todo <small>{this.props.title}</small></h1>
                </div>
                <TodoList todos={rows}></TodoList>
                {this.props.children}
            </div>
        );
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
                Perf.start();
                this.setState({todos:todos},function(){
                    Perf.stop();
                    Perf.printWasted();
                });
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

       var title,form,pageStatus,activePageClass,completedPageClass;

       if(this.state.page === 'active') {
           pageStatus = 0;
           title = 'Active todos';
           form = <TodoForm></TodoForm>;
           activePageClass ='active';
           completedPageClass =null;
       }else{
           pageStatus = 1;
           title = 'Completed todos';
           form = null;
           activePageClass = null;
           completedPageClass ='active';
       }
       var activeCount = this.state.todos.filter(function(todo){return todo.status === 0}).length;
       var completedCount = this.state.todos.length - activeCount;


       return (
           <div>
               <nav className="navbar navbar-default">
                   <div className="container-fluid">
                       <div className="navbar-header">
                           <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                               <span className="sr-only">Toggle navigation</span>
                               <span className="icon-bar"></span>
                               <span className="icon-bar"></span>
                               <span className="icon-bar"></span>
                           </button>
                           <a className="navbar-brand" href="#">Todo List</a>
                       </div>
                       <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                           <ul className="nav navbar-nav">
                               <li className={activePageClass}><a href="#/active">Active({activeCount})</a></li>
                               <li className={completedPageClass}><a href="#/completed">Completed({completedCount})</a></li>
                           </ul>
                       </div>
                   </div>
               </nav>
                <Page todos={this.state.todos} pageStatus={pageStatus} title={title}>
                    {form}
                </Page>
           </div>
       );
   }
});



React.render(
    <App></App>,
    document.getElementById('app-container')
);