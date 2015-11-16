var React = require('react');
var ReactDOM = require('react-dom');

var CommentList = React.createClass({
  render: function(){
    return (
      <div className="commentList">
        Hello, world! I am a CommentList.
      </div>
      );
  }
});

var CommentForm = React.createClass({
  render: function(){
    return (
      <div className="commentForm">
        Hello, world! I am a CommentForm.
      </div>
      );
  }
});