import { useState, useRef, useEffect } from 'react';
import {
    ActionIcon,
    Paper,
    Stack,
    Group,
    Text,
    TextInput,
    ScrollArea,
    Transition,
    Box,
    Avatar,
    Divider,
    Button
} from '@mantine/core';
import { IconMessageChatbot, IconX, IconSend, IconSparkles, IconTrendingUp, IconCash } from '@tabler/icons-react';
import axios from 'axios';

const Chatbot = () => {
    const [opened, setOpened] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hello! I am your ArtisanFlow AI Assistant. How can I help you grow your artisan business today?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const viewport = useRef(null);

    const scrollToBottom = () => {
        viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (textOverride) => {
        const messageText = textOverride || input;
        if (!messageText.trim() || loading) return;

        const newMessages = [...messages, { role: 'user', text: messageText }];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/api/ai/chat', {
                message: messageText,
                context: {
                    currentPath: window.location.pathname,
                    // Additional context can be added here (e.g., current product data)
                }
            });

            if (response.data.success) {
                setMessages([...newMessages, { role: 'assistant', text: response.data.reply }]);
            }
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', text: "I'm sorry, I'm having trouble connecting to my creative center right now." }]);
        } finally {
            setLoading(false);
        }
    };

    const QuickAction = ({ icon: Icon, label, onClick }) => (
        <Button 
            variant="light" 
            color="olive" 
            size="xs" 
            leftSection={<Icon size={14} />} 
            onClick={onClick}
            styles={{ root: { paddingLeft: 8, paddingRight: 8 } }}
        >
            {label}
        </Button>
    );

    return (
        <Box style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}>
            <Transition mounted={opened} transition="slide-up" duration={400} timingFunction="ease">
                {(styles) => (
                    <Paper 
                        shadow="xl" 
                        radius="lg" 
                        withBorder 
                        style={{ 
                            ...styles, 
                            width: 350, 
                            height: 500, 
                            display: 'flex', 
                            flexDirection: 'column',
                            overflow: 'hidden',
                            backgroundColor: '#ffffff'
                        }}
                        mb="md"
                    >
                        <Box p="md" bg="#556B2F" style={{ color: 'white' }}>
                            <Group justify="space-between">
                                <Group gap="xs">
                                    <IconSparkles size={20} />
                                    <Text fw={700}>ArtisanFlow AI</Text>
                                </Group>
                                <ActionIcon variant="transparent" color="white" onClick={() => setOpened(false)}>
                                    <IconX size={18} />
                                </ActionIcon>
                            </Group>
                        </Box>

                        <ScrollArea style={{ flex: 1 }} p="md" viewportRef={viewport}>
                            <Stack gap="md">
                                {messages.map((msg, index) => (
                                    <Group key={index} align="flex-start" justify={msg.role === 'user' ? 'flex-end' : 'flex-start'} gap="xs">
                                        {msg.role === 'assistant' && (
                                            <Avatar color="olive" radius="xl" size="sm">
                                                <IconSparkles size={14} />
                                            </Avatar>
                                        )}
                                        <Box 
                                            style={{ 
                                                maxWidth: '80%', 
                                                backgroundColor: msg.role === 'user' ? '#f0f4e8' : '#f8f9fa',
                                                padding: '8px 12px',
                                                borderRadius: '12px',
                                                borderTopRightRadius: msg.role === 'user' ? 2 : 12,
                                                borderTopLeftRadius: msg.role === 'assistant' ? 2 : 12
                                            }}
                                        >
                                            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</Text>
                                        </Box>
                                    </Group>
                                ))}
                                {loading && (
                                    <Text size="xs" c="dimmed" fs="italic">AI is thinking...</Text>
                                )}
                            </Stack>
                        </ScrollArea>

                        <Divider />
                        
                        <Box p="xs">
                            <ScrollArea h={40} type="never">
                                <Group gap="xs" wrap="nowrap">
                                    <QuickAction 
                                        icon={IconTrendingUp} 
                                        label="Improve Quality" 
                                        onClick={() => handleSend("How can I improve my product quality?")} 
                                    />
                                    <QuickAction 
                                        icon={IconCash} 
                                        label="Price Advice" 
                                        onClick={() => handleSend("What price should I keep for my product based on materials used?")} 
                                    />
                                </Group>
                            </ScrollArea>
                        </Box>

                        <Box p="md" style={{ borderTop: '1px solid #eee' }}>
                            <TextInput
                                placeholder="Ask me anything..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                rightSection={
                                    <ActionIcon 
                                        color="olive" 
                                        variant="filled" 
                                        onClick={() => handleSend()}
                                        disabled={!input.trim()}
                                    >
                                        <IconSend size={16} />
                                    </ActionIcon>
                                }
                            />
                        </Box>
                    </Paper>
                )}
            </Transition>

            <ActionIcon 
                size={60} 
                radius="xl" 
                color="olive" 
                variant="filled" 
                shadow="xl"
                onClick={() => setOpened(!opened)}
                style={{ boxShadow: '0 8px 24px rgba(85, 107, 47, 0.4)' }}
            >
                {opened ? <IconX size={28} /> : <IconMessageChatbot size={28} />}
            </ActionIcon>
        </Box>
    );
};

export default Chatbot;
