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

  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [stories, setStories] = React.useState(initialStories);

  const handleSearch = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    const newStories = stories.filter(
      (story) => item.objectID !== story.objectID
    );
    setStories(newStories);
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
      <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
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
