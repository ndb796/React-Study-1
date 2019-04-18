import TextTruncate from 'react-text-truncate';
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Link as RouterLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';

const styles = theme => ({
    hidden: {
        display: 'none'
    },
    fab: {
        position: 'fixed',
        bottom: '20px',
        right: '20px'
    },
});

const databaseURL = "https://wordcloudtest1.firebaseio.com/";

class Texts extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileName: '',
            fileContent: null,
            texts: '',
            textName: '',
            dialog: false
        }
    }

    _get() {
        fetch(`${databaseURL}/texts.json`).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(texts => this.setState({texts: (texts == null) ? {} : texts}));
    }

    _post(text) {
        return fetch(`${databaseURL}/texts.json`, {
            method: 'POST',
            body: JSON.stringify(text)
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(data => {
            let nextState = this.state.texts;
            nextState[data.name] = text;
            this.setState({texts: nextState});
        });
    }

    _delete(id) {
        return fetch(`${databaseURL}/texts/${id}.json`, {
            method: 'DELETE'
        }).then(res => {
            if(res.status != 200) {
                throw new Error(res.statusText);
            }
            return res.json();
        }).then(() => {
            let nextState = this.state.texts;
            delete nextState[id];
            this.setState({texts: nextState});
        });
    }

    componentDidMount() {
        this._get();
    }

    handleDialogToggle = () => this.setState({
        dialog: !this.state.dialog,
        fileName: '',
        fileContent: '',
        textName: ''
    })

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleSubmit = () => {
        const text = {
            textName: this.state.textName,
            textContent: this.state.fileContent
        }
        this.handleDialogToggle();
        if (!text.textName || !text.textContent) {
            return;
        }
        this._post(text);
    }

    handleDelete = (id) => {
        this._delete(id);
    }

    handleFileChange = (e) => {
        let reader = new FileReader();
        reader.onload = () => {
            let text = reader.result;
            this.setState({
                fileContent: text
            })
        }
        reader.readAsText(e.target.files[0], "EUC-KR");
        this.setState({
            fileName: e.target.value
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                {Object.keys(this.state.texts).map(id => {
                    const text = this.state.texts[id];
                    return (
                        <Card key={id}>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    내용: {text.textContent.substring(0, 24) + '...'}
                                </Typography>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography variant="h5" component="h2">
                                            {text.textName.substring(0, 14) + '...'}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="h5" component="h2">
                                            <Link component={RouterLink} to={"detail/" + id}>
                                                <Button variant="contained" color="primary">보기</Button>
                                            </Link>
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button variant="contained" color="primary" onClick={() => this.handleDelete(id)}>삭제</Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                })}
                <Fab color="primary" className={classes.fab} onClick={this.handleDialogToggle}>
                    <AddIcon />
                </Fab>
                <Dialog open={this.state.dialog} onClose={this.handleDialogToggle}>
                    <DialogTitle>텍스트 추가</DialogTitle>
                    <DialogContent>
                    <TextField label="텍스트 이름" type="text" name="textName" value={this.state.textName} onChange={this.handleValueChange} /><br />
                    <input className={classes.hidden} accept="text/plain" id="raised-button-file" type="file" file={this.state.file} value={this.state.fileName} onChange={this.handleFileChange} />
                    <label htmlFor="raised-button-file">
                        <Button variant="contained" color="primary" component="span" name="file">
                            {this.state.fileName === ''? ".txt 파일 선택" : this.state.fileName}
                        </Button>
                    </label><br/>
                    <TextTruncate
                        line={1}
                        truncateText="..."
                        text={this.state.fileContent}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogToggle}>닫기</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Texts);