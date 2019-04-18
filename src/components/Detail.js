import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

class Detail extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Card>
                <CardContent>
                    {this.props.match.params.textID}
                </CardContent>
            </Card>
        );
    }
}

export default Detail;