import React from 'react';
import { Form, Input, Button, message, Card } from 'antd';
import api from '../api/axios';

const RecipeForm = ({ onRecipeAdded }) => {
  	const [form] = Form.useForm();

	const onFinish = async (values) => {
		const ingredientsArray = values.ingredients.split(',').map(i => i.trim());
		try {
			await api.post('/api/recipes', { ...values, ingredients: ingredientsArray });
			message.success('Recipe saved successfully!');
			form.resetFields();
			onRecipeAdded();
		} catch (err) {
			message.error('Database connection failed');
		}
	};

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            <Form.Item name="title" label="Recipe Name" rules={[{ required: true, message: 'Title is required' }]}>
                <Input placeholder="Enter title (e.g. Pasta)" size="large" />
            </Form.Item>

            <Form.Item name="ingredients" label="Ingredients" rules={[{ required: true, message: 'Add at least one' }]}>
                <Input placeholder="Onion, Salt, Chicken..." size="large" />
            </Form.Item>

            <Form.Item name="instructions" label="How to cook?" rules={[{ required: true }]}>
                <Input.TextArea rows={4} placeholder="Step by step instructions..." />
            </Form.Item>

            <Button type="primary" htmlType="submit" block size="large" style={{ fontWeight: 'bold', height: '45px' }}>
                ADD TO COLLECTION
            </Button>
        </Form>
  );
};

export default RecipeForm;