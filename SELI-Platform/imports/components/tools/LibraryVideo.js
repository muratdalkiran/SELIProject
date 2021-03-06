import React from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';

import FileInformation from './FileInformation';

import CourseFilesCollection from '../../../lib/CourseFilesCollection';

export default class LibraryVideo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
    }
  }

  componentDidMount(){

  }

  useVideo(){
    this.props.getFileInformation(this.props.file);
  }

  delete(){
    Meteor.call("RemoveCourseFile", this.props.file._id, function (err) {
      if (err) {
        this.props.showControlMessage(this.props.language.errorDeleting);
        return;
      }
    });
    this.props.showControlMessage(this.props.language.fileDeletedS);
  }

  addToFavorites(){
    let meta = this.props.file.meta;
    meta.isFavorite = !meta.isFavorite;
    CourseFilesCollection.update(
      { _id: this.props.file._id },
      { $set:
        {
          meta: meta,
        }
      }
    );
  }

  play(){
    document.getElementById(this.props.file._id).play();
    this.setState({
      playing: true,
    });
  }

  pause(){
    document.getElementById(this.props.file._id).pause();
    this.setState({
      playing: false,
    });
  }

  render() {
    return(
      <Card className="video-card">
        <CardMedia
          component="video"
          src={this.props.file.link}
          title={this.props.file.name}
          className="card-media-video"
          onClick={() => this.useVideo()}
          id={this.props.file._id}
        />
        <CardActions className="card-actions-bottom-container" disableSpacing>
          {
            this.state.playing ?
              <Tooltip title={this.props.language.pause}>
                <IconButton className="card-button" onClick={() => this.pause()} aria-label="add to favorites">
                  <PauseIcon className="card-icon"/>
                </IconButton>
              </Tooltip>
            :
            <Tooltip title={this.props.language.play}>
              <IconButton className="card-button" onClick={() => this.play()} aria-label="add to favorites">
                <PlayArrowIcon className="card-icon"/>
              </IconButton>
            </Tooltip>
          }
          <Tooltip title={this.props.language.addToFavorites}>
            <IconButton color={this.props.file.meta.isFavorite ? `primary` : undefined} className="card-button" onClick={() => this.addToFavorites()} aria-label="add to favorites">
              <FavoriteIcon className="card-icon"/>
            </IconButton>
          </Tooltip>
          <Tooltip title={this.props.language.deleteFile}>
            <IconButton className="card-button" onClick={() => this.delete()} aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <FileInformation type={this.props.file.type} file={this.props.file} language={this.props.language}/>
        </CardActions>
      </Card>
      );
    }
  }
