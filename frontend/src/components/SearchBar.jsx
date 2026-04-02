import React from 'react';
import { Input } from 'antd';

const { Search } = Input;

const SearchBar = ({ onSearch, onClear }) => {
    return (
        <Search
            placeholder="Search ingredients..."
            allowClear
            enterButton="AI Search"
            size="large"
            onSearch={(value) => value ? onSearch(value.split(',').map(i => i.trim())) : onClear()}
            style={{ width: 400 }}
        />
    );
};

export default SearchBar;