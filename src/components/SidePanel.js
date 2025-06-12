import { useState } from 'react';
import { Menu, X, Printer } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const SidePanel = ({ selectedDetails, isDarkMode = false, colors = {
  border: '#e2e8f0',
  darkBg: '#1e293b',
  itemBg: '#ffffff',
  shadow: 'rgba(0, 0, 0, 0.1)',
  darkText: '#f8fafc',
  text: '#1e293b',
  background: '#f8fafc',
  textLight: '#64748b',
  secondary: '#3b82f6',
  primary: '#6366f1'
} }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="relative">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{
                            width: 360,
                            borderLeft: `1px solid ${colors.border}`,
                            padding: 24,
                            background: isDarkMode ? colors.darkBg : colors.itemBg,
                            boxShadow: `0 4px 12px ${colors.shadow}`,
                        }}
                        className="fixed right-0 top-0 h-full overflow-y-auto z-10"
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: 600, color: isDarkMode ? colors.darkText : colors.text }}>
                                Properties Panel
                            </h3>
                            <motion.button
                                onClick={() => setIsOpen(false)}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ background: "transparent", border: "none", cursor: "pointer" }}
                            >
                                <X size={20} stroke={isDarkMode ? colors.darkText : colors.text} strokeWidth="2" />
                            </motion.button>
                        </div>

                        {selectedDetails?.pathEdges ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    background: isDarkMode ? colors.darkBg : "white",
                                    borderRadius: 10,
                                    padding: 16,
                                    boxShadow: `0 2px 8px ${colors.shadow}`,
                                }}
                            >
                                <p style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: 12, color: isDarkMode ? colors.darkText : colors.text }}>
                                    Node: {selectedDetails.label}
                                </p>
                                <p style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: 8, color: isDarkMode ? colors.darkText : colors.text }}>
                                    Transition Path:
                                </p>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {selectedDetails.pathEdges.map((e, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            style={{
                                                padding: "8px",
                                                background: isDarkMode ? colors.darkBg : colors.background,
                                                borderRadius: 6,
                                                margin: "4px 0",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <span style={{ fontSize: "0.9rem", color: isDarkMode ? colors.darkText : colors.text }}>
                                                {e.source} ➔ {e.target}
                                            </span>
                                        </motion.li>
                                    ))}
                                </ul>
                                <motion.button
                                    onClick={() => window.print()}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        marginTop: 16,
                                        padding: "8px 16px",
                                        background: colors.secondary,
                                        color: "white",
                                        border: "none",
                                        borderRadius: 6,
                                        cursor: "pointer",
                                        fontSize: "1rem",
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <Printer size={16} />
                                    Print Path
                                </motion.button>
                            </motion.div>
                        ) : (
                            <p style={{ color: isDarkMode ? colors.darkText : colors.textLight, fontSize: "0.9rem" }}>
                                Select a node's ➔ button to view details.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                        position: "fixed",
                        right: 16,
                        top: 16,
                        padding: "8px",
                        background: colors.primary,
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        cursor: "pointer",
                        zIndex: 10
                    }}
                >
                    <Menu size={20} stroke="white" strokeWidth="2" />
                </motion.button>
            )}
        </div>
    );
};

export default SidePanel;