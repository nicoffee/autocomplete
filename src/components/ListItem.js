import React, { Component } from 'react'

const ListItem = (props) => {
        return (+props.idx === props.focusedId) ?
          <li
            className="focused"
            onClick={(e) => props.onClick(e, props.idx)}
            ref={props.listRef}
          >
              {props.children}
          </li> :
          <li onClick={(e) => props.onClick(e, props.idx)}>
              {props.children}
          </li>

};

export default ListItem;