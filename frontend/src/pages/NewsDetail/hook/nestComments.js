export function nestComments(comments) {
    const commentMap = {};
    const nested = [];
  
    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
    });
  
    comments.forEach(comment => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        nested.push(comment);
      }
    });
  
    return nested;
  }
  