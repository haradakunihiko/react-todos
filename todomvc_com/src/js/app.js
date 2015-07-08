(function(){
    var React = require('react/addons');
    //var util = require('./util.js');

    var TodoApp = React.createClass({
        render: function(){
            return (
                <div>
                    <header>
                        <h1>TODO</h1>
                    </header>
                    <section>
                        <button type="button"></button>
                        <input type="text"></input>
                    </section>
                    <section>
                        <ul>
                            <li>
                                <input type="checkbox"></input>
                                <span></span>
                                <button type="button"></button>
                            </li>
                        </ul>
                    </section>
                    <footer>
                        <span>1 item left</span>
                        <button type="button">All</button>
                        <button type="button">Active</button>
                        <button type="button">Completed</button>
                    </footer>
                </div>
            );
        }
    });

    React.render(
        <TodoApp></TodoApp>,
        document.getElementById('todo-app')
    );
})();

//util();
