import React from 'react';
import './App.css';

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);

  }, [value, key]);
  return [value, setValue];
}

// Reducer function (state and action as arguments)
// const storiesReducer = (state, action) => {
//   if (action.type === 'SET_STORIES') {
//     return action.payload;
//   } 
//   else if (action.type === 'REMOVE_STORY') {
//     return state.filter(
//       (story) => action.payload.objectID !== story.objectID
//     );
//   }
//   else {
//     throw new Error();
//   }
// }
// Migrate to a switch , case instead of if else

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
      );
    default:
      throw new Error();
  }

}


const App = () => {
  const initialStories = [
    {
      title: "React",
      url: "https://reactjs.org/",
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: 0,
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: 1,
    },
  ];

  const getAsyncStories = () => 
    // Promise.resolve({data: {stories: initialStories} });
    new Promise((resolve) => 
    setTimeout(
      () => resolve({ data: {stories: initialStories } }),
      2000
    )
  );


  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  // const [stories, setStories] = React.useState([]);
    // Replace useState with useReducer for managing the stories 
    const [stories, dispatchStories] = React.useReducer(storiesReducer,[]
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [isError, setIsError] = React.useState(false);



  React.useEffect(() => {
    setIsLoading(true);

    getAsyncStories().then((result) => {
      // setStories(result.data.stories);
      dispatchStories({
        type: 'SET_STORIES',
        payload: result.data.stories,
      });
      setIsLoading(false);
    });
    // .catch(() => setIsError(true));
  }, []);

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    // setStories(newStories);
    dispatchStories({
      type: 'REMOVE_STORIES',
      payload: item,
    });
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div>
      <h1>My Hacker Stories</h1>
      <InputWithLabel
        id="search"
        value={searchTerm}
        onInputChange={handleSearch}
        >
          <strong>Search:</strong>    
        </InputWithLabel>
      <hr/>
      
      {/* list and onremoveitem are callback handlers used in the list components eventually */}
      {isLoading? 
      (
        <p>Loading ...</p>
      )
      :(
        <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
      )}
    </div>
  )
}

const InputWithLabel = ({ id, label, value, onInputChange, type="text", children,isFocused}) => (
  <React.Fragment>
    <label htmlFor={id}>{children}</label>
    &nbsp;
    <input
      id={id}
      type={type}
      value={value}
      autoFocus={isFocused}
      onChange={onInputChange}
    />
  </React.Fragment>
);

const Search = ({search, onSearch}) => (
    <React.Fragment>
      <label htmlFor="search">Search: </label>
      <input 
      id="search" 
      type="text" 
      onChange={onSearch} 
      value={search}/>
    </React.Fragment>
)

const List = ({list, onRemoveItem}) => ( 
      <ul>
        {list.map((item) => (
          <Item
           key={item.objectID}
           item={item}
           onRemoveItem={onRemoveItem}
          />
        ))}
      </ul>
    
);

const Item = ({item, onRemoveItem}) => {
  const handleRemoveItem = () => {
    onRemoveItem(item);
  };

  return (
    <li>
      <span>
        <a href={item.url}>{item.title}</a> 
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span> 
      <span>{item.points}</span>
      <span>
        {/* <button type="button" onClick={handleRemoveItem}>
          Dismiss
        </button> */}
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss 
        </button>
      </span>
    </li>   
  );
}

export default App;
