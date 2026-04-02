import React, { useState } from 'react';
import { Card, Tag, Typography, Space, Tooltip, Modal, List, Steps, Button } from 'antd';
import { FireOutlined, EyeOutlined, CheckCircleOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const RecipeCard = ({ recipe }) => {
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isCookModalOpen, setIsCookModalOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Instruction string-ke full stop (.) diye bhange steps banano
    const steps = recipe.instructions.split('.').filter(s => s.trim().length > 0);

    return (
        <>
            <Card
                hoverable
                style={{ marginBottom: 16, borderRadius: '15px', overflow: 'hidden' }}
                actions={[
                    <Tooltip title="View Details">
                        <EyeOutlined key="view" onClick={() => setIsViewModalOpen(true)} />
                    </Tooltip>,
                    <Tooltip title="Cooking Mode">
                        <FireOutlined key="cook" onClick={() => setIsCookModalOpen(true)} />
                    </Tooltip>,
                ]}
            >
                <Title level={4} style={{ marginBottom: 8 }}>{recipe.title}</Title>
                
                <div style={{ marginBottom: '12px' }}>
                    {recipe.ingredients?.map((ing, i) => (
                        <Tag color="volcano" key={i} style={{ borderRadius: '4px' }}>
                            {ing.toUpperCase()}
                        </Tag>
                    ))}
                </div>

                <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ fontSize: '14px' }}>
                    {recipe.instructions}
                </Paragraph>
            </Card>

            {/* --- MODAL 1: VIEW DETAILS --- */}
            <Modal 
                title={<Title level={3}>Recipe Overview</Title>} 
                open={isViewModalOpen} 
                onCancel={() => setIsViewModalOpen(false)}
                footer={null}
                width={600}
            >
                <Title level={5}>Ingredients Needed:</Title>
                <List
                    dataSource={recipe.ingredients}
                    renderItem={(item) => (
                        <List.Item><Space><CheckCircleOutlined style={{ color: '#52c41a' }} /> {item}</Space></List.Item>
                    )}
                />
                <Title level={5} style={{ marginTop: '20px' }}>Full Instructions:</Title>
                <Paragraph className="bg-slate-50 p-4 rounded-lg italic">"{recipe.instructions}"</Paragraph>
            </Modal>

            {/* --- MODAL 2: COOKING MODE (STEP BY STEP) --- */}
            <Modal 
                title={<Title level={3}><FireOutlined /> Cooking: {recipe.title}</Title>} 
                open={isCookModalOpen} 
                onCancel={() => { setIsCookModalOpen(false); setCurrentStep(0); }}
                footer={[
                    <Button key="prev" disabled={currentStep === 0} onClick={() => setCurrentStep(currentStep - 1)} icon={<LeftOutlined />}>Previous</Button>,
                    <Button key="next" type="primary" disabled={currentStep === steps.length - 1} onClick={() => setCurrentStep(currentStep + 1)}>Next Step <RightOutlined /></Button>,
                    currentStep === steps.length - 1 && <Button key="done" type="primary" success onClick={() => setIsCookModalOpen(false)}>Finish! 🥗</Button>
                ].filter(Boolean)}
                width={700}
            >
                <div style={{ padding: '20px 0' }}>
                    <Steps
                        current={currentStep}
                        size="small"
                        items={steps.map((_, index) => ({ title: `Step ${index + 1}` }))}
                        style={{ marginBottom: '30px' }}
                    />
                    
                    <div style={{ background: '#fff7e6', padding: '30px', borderRadius: '20px', border: '2px dashed #ffbb96', textAlign: 'center', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Title level={4} style={{ color: '#d46b08', margin: 0 }}>
                            {steps[currentStep]}
                        </Title>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RecipeCard;