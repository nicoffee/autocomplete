import React from 'react'

const ListItem = (props) => {
        return (+props.idx === props.focusedId) ?
          <li
            className="focused"
            onMouseDown={(e) => props.onMouseDown(e, props.idx)}
            ref={props.listRef}
          >
              {props.children}
          </li> :
          <li onMouseDown={(e) => props.onMouseDown(e, props.idx)}>
              {props.children}
          </li>

};

export default ListItem;