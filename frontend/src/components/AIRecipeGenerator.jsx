
import React, { useState } from 'react';
import { Card, Input, Button, Typography, Space, message, Spin } from 'antd';
import { RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import api from '../api/axios';

const { Title, Text } = Typography;
const { TextArea } = Input;

const AIRecipeGenerator = ({ onRecipeGenerated }) => {
    const [ingredients, setIngredients] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAIGenerate = async () => {
        if (!ingredients.trim()) {
            return message.warning('Please enter some ingredients first!');
        }

        setLoading(true);
        try {
            const res = await api.post('/api/ai/generate', { ingredients });
            
            if (res.status === 200) {
                message.success('AI has cooked a new recipe for you! ✨');
                setIngredients('');
                onRecipeGenerated(); 
            }
        } catch (err) {
            console.error(err);
            message.error('AI is busy right now. Try again later!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card 
            style={{ 
                marginBottom: '24px', 
                borderRadius: '15px', 
                background: 'linear-gradient(135.2deg, #fffcf0 0.8%, #fff 98%)',
                border: '1px solid #ffe7ba' 
            }}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <RobotOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                    <Title level={4} style={{ margin: 0 }}>AI Magic Chef</Title>
                </div>
                
                <Text type="secondary">
                    Enter the ingredients you have, and let AI suggest a perfect recipe!
                </Text>

                <TextArea 
                    placeholder="e.g. Tomato, Egg, Potato, Cheese..." 
                    rows={2}
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                    disabled={loading}
                />

                <Button 
                    type="primary" 
                    icon={loading ? <Spin size="small" /> : <ThunderboltOutlined />} 
                    onClick={handleAIGenerate}
                    loading={loading}
                    block
                    style={{ 
                        height: '45px', 
                        fontWeight: 'bold', 
                        background: '#fa8c16',
                        border: 'none'
                    }}
                >
                    {loading ? 'AI IS COOKING...' : 'GENERATE AI RECIPE'}
                </Button>
            </Space>
        </Card>
    );
};

export default AIRecipeGenerator;