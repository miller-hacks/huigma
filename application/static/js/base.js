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
            message: 'Мы начинаем КВН',
            overlay: false
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
                // this.refs.secret.getDOMNode().value = data.content;
                // this.refs.number.getDOMNode().value = data.num;
                this.setState({
                    state: 'recieve',
                    message: data.content, 
                    overlay: true
                });
                //console.log('success', data);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    state: 'recieve', 
                    message: 'Something went wrong: ' + status.toString(), 
                    overlay: true
                });
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
                this.refs.secret.getDOMNode().value = '';
                this.setState({message: data.link, overlay: true});
                //console.log('success', data);
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    state: 'recieve',
                    message: 'Something went wrong: ' + status.toString(),
                    overlay: true
                });
                //console.error('error', status, err.toString());
            }.bind(this)
        });
    },
    handleSubmit: function() {
        this.post({
            content: this.refs.secret.getDOMNode().value,
            expire: this.refs.expire.getDOMNode().value,
            num: this.refs.number.getDOMNode().value,
            callback: this.refs.callback.getDOMNode().value
        });

        return false;
    },
    handleOverlayClose: function() {
        this.setState({
            message: '',
            overlay: false
        });
    },
    render: function(){
        var state = this.state.state,
            container_classes = ['b-webigma'];
            button_is_disabled = false;

        container_classes.push('b-webigma_state_' + state);
        container_classes = container_classes.join(' ');

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
                ), 

                Overlay({content: this.state.message, is_open: this.state.overlay, onOverlayClose: this.handleOverlayClose})
            )
        );
    }
    });


    var Overlay = React.createClass({displayName: 'Overlay',
        getInitialState: function(){
            return {
            };
        },
        getDefaultProps: function(){
            return {
                content: (React.DOM.p(null, "Bee-bee, bee-bee, yeah"))
            };
        },
        componentDidMount: function() {
            
        },
        render: function(){
            var overlay_classes = ['b-overlay'],
                overlay_style = 'b-overlay_scale';

            overlay_classes.push(overlay_style);
            if(this.props.is_open) overlay_classes.push(overlay_style + '_open');
            overlay_classes = overlay_classes.join(' ');

            return (
                React.DOM.div({className: overlay_classes}, 
                    React.DOM.button({type: "button", className: "b-overlay__close", onClick: this.props.onOverlayClose}, 
                        React.DOM.i({className: "fa fa-ban"})
                    ), 
                    React.DOM.div({className: "b-overlay__content"}, this.props.content)
                )
            );
        }
    });


    React.renderComponent(
    Webigma({settings: settings, path: path}),
    document.getElementById('app')
    );