import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Typography, Empty, Spin, Space } from 'antd';
import api from './api/axios';
import RecipeForm from './components/RecipeForm';
import RecipeCard from './components/RecipeCard';
import SearchBar from './components/SearchBar';
import AIRecipeGenerator from './components/AIRecipeGenerator';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

function App() {
  	const [recipes, setRecipes] = useState([]);
  	const [loading, setLoading] = useState(false);

	const loadRecipes = async () => {
		setLoading(true);
		try {
			const res = await api.get('/api/recipes');
			setRecipes(Array.isArray(res.data) ? res.data : []);
		} catch (err) { console.error(err); }
			setLoading(false);
	};

  	useEffect(() => { loadRecipes(); }, []);

	return (
		<Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
		<Header style={{ background: '#fff', padding: '0 50px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
			<Title level={2} style={{ margin: 0, color: '#fa8c16' }}>🍳AI Recipe Planner</Title>
			<SearchBar onSearch={async (ing) => {
			setLoading(true);
			try {
				const res = await api.post('/api/recipes/search', ing); 
				setRecipes(res.data);
			} catch (err) {
				console.error("Search failed:", err);
			}
			setLoading(false);
			}} onClear={loadRecipes} />
		</Header>

		<Content style={{ padding: '40px 50px' }}>
			<Row gutter={48}>
			<Col span={8}>
            {/* --- NEW AI SECTION --- */}
            <AIRecipeGenerator onRecipeGenerated={loadRecipes} />
            
            <Title level={4} style={{ marginBottom: 20 }}>Manual Add</Title>
            <div style={{ background: '#fff', padding: '24px', borderRadius: '15px' }}>
              <RecipeForm onRecipeAdded={loadRecipes} />
            </div>
          </Col>

			<Col span={16}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
				<Title level={4}>Recipe Gallery</Title>
				<Text type="secondary">{recipes.length} items found</Text>
				</div>
				
				<div style={{ marginTop: '20px' }}>
				{loading ? (
					<div style={{ textAlign: 'center', marginTop: 100 }}><Spin size="large" description="Cooking data..." /></div>
				) : (
					<Row gutter={[20, 20]}>
					{recipes.length > 0 ? (
						recipes.map(r => (
						<Col span={12} key={r._id}>
							<RecipeCard recipe={r} />
						</Col>
						))
					) : (
						<Col span={24} style={{ marginTop: 50 }}><Empty description="No Recipes in Cabinet" /></Col>
					)}
					</Row>
				)}
				</div>
			</Col>
			</Row>
		</Content>
		<Footer style={{ textAlign: 'center', color: '#bfbfbf' }}>AI Recipe Planner Dashboard ©2026 Created by CheSubhro</Footer>
		</Layout>
	);
}

export default App;