    /** @jsx React.DOM */
    var path = window.location.pathname.slice(1),
    settings = {
        api_url: '/api'
    };

    var Webigma = React.createClass({
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
            <div className={container_classes}>
                <h1 className="b-webigma__heading">All hail the Huigma</h1>
                <form method="post" action={this.props.settings.api_url}>
                    <textarea className="b-webigma__text" ref="secret" spellCheck="false" />
                    <input className="b-webigma__text-input" type="text" ref="expire" placeholder="[expire, sec] 1800" />
                    <input className="b-webigma__text-input" type="text" ref="number" placeholder="[number, num] 1" />
                    <input className="b-webigma__text-input" type="text" ref="callback" placeholder="[callback, url]" />
                    <button onClick={this.handleSubmit} className="b-webigma__submit" disabled={button_is_disabled}>
                        <i className="fa fa-lock"></i>
                    </button>
                </form>

                <div className="b-webigma__message-wrapper">
                    <div className="b-webigma__message">{this.state.message}</div>
                </div>

                <div className="b-webigma__copyright">
                    © <a href="https://github.com/miller-hacks">miller-hacks</a>, 2014
                </div>
            </div>
        );
    }
    });


    React.renderComponent(
    <Webigma settings={settings} path={path} />,
    document.getElementById('app')
    );