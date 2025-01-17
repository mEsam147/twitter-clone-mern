import React from "react";

const CommentModal = ({ item }) => {


  return (
    <div>
      <dialog id={`my_modal_2`} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Comments for post {postId}</h3>
          <p className="py-4">Press ESC key or click outside to close</p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default CommentModal;
