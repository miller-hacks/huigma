    /** @jsx React.DOM */
    var path = window.location.pathname.slice(1),
    settings = {
        api_url: '/api'
    };

    var Webigma = React.createClass({displayName: 'Webigma',
    getInitialState: function() {
        //console.log(this.props.settings);

        return {
            state: 'init',
            message: 'Мы начинаем КВН'
        };
    },
    componentDidMount: function() {
        if(this.props.path) this.get(path);
    },
    get: function(data) {
        this.setState({state: 'recieving'});

        $.ajax({
            url: this.props.settings.api_url + '/' + data,
            method: 'get',
            success: function(data) {
                this.setState({state: 'recieve'});
                this.refs.secret.getDOMNode().value = data.content;
                this.refs.number.getDOMNode().value = data.num;
                //console.log('success', data);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({state: 'recieve'});
                //console.error('error', status, err.toString());
            }.bind(this)
        });
    },
    post: function(data) {
        //console.log('posting', data);
        this.setState({state: 'posting'});

        $.ajax({
            url: this.props.settings.api_url,
            data: JSON.stringify(data),
            dataType: 'json',
            method: 'post',
            success: function(data) {
                this.setState({state: 'recieve'});
                this.refs.secret.getDOMNode().value = data.link;
                //console.log('success', data);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({state: 'recieve'});
                //console.error('error', status, err.toString());
            }.bind(this)
        });
    },
    handleSubmit: function(e) {
        this.post({
            content: this.refs.secret.getDOMNode().value,
            expire: this.refs.expire.getDOMNode().value,
            num: this.refs.number.getDOMNode().value,
            callback: this.refs.callback.getDOMNode().value
        });

        return false;
    },
    render: function(){
        var state = this.state.state,
            container_classes = 'b-webigma';
            button_is_disabled = false;

        container_classes = container_classes + ' b-webigma_state_' + state;

        switch(state) {
            case 'posting':
            case 'recieving':
                button_is_disabled = true;
                break;
            case 'recieve':
                break;
            default:
                break;
        }

        return (
            React.DOM.div({className: container_classes}, 
                React.DOM.h1({className: "b-webigma__heading"}, "All hail the Huigma"), 
                React.DOM.form({method: "post", action: this.props.settings.api_url}, 
                    React.DOM.textarea({className: "b-webigma__text", ref: "secret", spellCheck: "false"}), 
                    React.DOM.input({className: "b-webigma__text-input", type: "text", ref: "expire", placeholder: "[expire, sec] 1800"}), 
                    React.DOM.input({className: "b-webigma__text-input", type: "text", ref: "number", placeholder: "[number, num] 1"}), 
                    React.DOM.input({className: "b-webigma__text-input", type: "text", ref: "callback", placeholder: "[callback, url]"}), 
                    React.DOM.button({onClick: this.handleSubmit, className: "b-webigma__submit", disabled: button_is_disabled}, 
                        React.DOM.i({className: "fa fa-lock"})
                    )
                ), 

                React.DOM.div({className: "b-webigma__message-wrapper"}, 
                    React.DOM.div({className: "b-webigma__message"}, this.state.message)
                ), 

                React.DOM.div({className: "b-webigma__copyright"}, 
                    "© ", React.DOM.a({href: "https://github.com/miller-hacks"}, "miller-hacks"), ", 2014"
                )
            )
        );
    }
    });


    React.renderComponent(
    Webigma({settings: settings, path: path}),
    document.getElementById('app')
    );