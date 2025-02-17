
import streamlit as st
import pandas as pd
from datetime import datetime
import plotly.graph_objects as go
import plotly.express as px
import numpy as np

# Set page config
st.set_page_config(page_title="Options Trading Journal", layout="wide")

# Initialize session state variables
if 'trades' not in st.session_state:
    st.session_state.trades = pd.DataFrame(columns=[
        'date', 'symbol', 'trade_type', 'entry_price', 'exit_price', 
        'stop_loss', 'target', 'position_size', 'pnl', 'setup_type',
        'market_condition', 'psychology', 'notes', 'status'
    ])

def calculate_position_size(capital, risk_percent, entry, stop_loss):
    risk_amount = capital * (risk_percent / 100)
    position_size = risk_amount / abs(entry - stop_loss)
    return round(position_size)

def calculate_pnl(position_size, entry_price, exit_price):
    return position_size * (exit_price - entry_price)

# Header
st.title("🚀 Advanced Options Trading Journal")
st.markdown("Track your trades, analyze performance, and improve your psychology")

# Sidebar for analytics
with st.sidebar:
    st.header("📊 Trading Statistics")
    if not st.session_state.trades.empty:
        completed_trades = st.session_state.trades[st.session_state.trades['status'] == 'Closed']
        if not completed_trades.empty:
            total_trades = len(completed_trades)
            winning_trades = len(completed_trades[completed_trades['pnl'] > 0])
            win_rate = (winning_trades / total_trades) * 100 if total_trades > 0 else 0
            total_profit = completed_trades['pnl'].sum()
            
            st.metric("Total Trades", total_trades)
            st.metric("Win Rate", f"{win_rate:.2f}%")
            st.metric("Total P&L", f"₹{total_profit:,.2f}")
            
            # Show equity curve
            cumulative_pnl = completed_trades['pnl'].cumsum()
            fig = px.line(cumulative_pnl, title='Equity Curve')
            st.plotly_chart(fig)

# Main content
tabs = st.tabs(["Trade Entry", "Trade Journal", "Analytics"])

with tabs[0]:
    st.header("📝 Trade Entry Form")
    
    col1, col2 = st.columns(2)
    
    with col1:
        # Market Analysis
        st.subheader("Market Analysis")
        market_condition = st.selectbox(
            "Market Condition",
            ["Bullish", "Bearish", "Sideways", "Volatile"]
        )
        setup_type = st.selectbox(
            "Setup Type",
            ["Breakout", "Reversal", "Trend Following", "Support/Resistance", "Pattern"]
        )
        
        # Position Sizing
        st.subheader("Position Sizing")
        initial_capital = st.number_input("Initial Capital (₹)", value=100000.0, step=1000.0)
        risk_percent = st.number_input("Risk Per Trade (%)", value=1.0, max_value=5.0, step=0.1)

    with col2:
        # Trade Details
        st.subheader("Trade Details")
        symbol = st.text_input("Stock Symbol", placeholder="e.g., RELIANCE")
        trade_type = st.selectbox("Trade Type", ["Call Option", "Put Option", "Swing Trade"])
        entry_price = st.number_input("Entry Price (₹)", value=0.0, step=0.1)
        exit_price = st.number_input("Exit Price (₹)", value=0.0, step=0.1)
        target_price = st.number_input("Target Price (₹)", value=0.0, step=0.1)
        stop_loss = st.number_input("Stop Loss (₹)", value=0.0, step=0.1)
        status = st.selectbox("Trade Status", ["Open", "Closed"])
        
        # Psychology Check
        st.subheader("Psychology Check")
        emotion = st.selectbox(
            "Current Emotional State",
            ["Confident & Calm", "Fearful", "Excited", "FOMO", "Revenge Trading Urge"]
        )

    # Trade Notes
    st.subheader("Trade Notes")
    setup_notes = st.text_area("Setup Analysis", height=100)
    risk_notes = st.text_area("Risk Management Notes", height=100)

    # Calculate position size and PnL
    if entry_price and stop_loss:
        position_size = calculate_position_size(initial_capital, risk_percent, entry_price, stop_loss)
        st.info(f"Recommended Position Size: {position_size} units")
        
        if exit_price and status == "Closed":
            pnl = calculate_pnl(position_size, entry_price, exit_price)
            st.metric("Realized P&L", f"₹{pnl:,.2f}")
        
        # Calculate R:R ratio
        if target_price:
            reward = abs(target_price - entry_price)
            risk = abs(entry_price - stop_loss)
            rr_ratio = reward / risk if risk != 0 else 0
            st.metric("Risk:Reward Ratio", f"{rr_ratio:.2f}")

    # Submit button
    if st.button("Log Trade"):
        if emotion in ["FOMO", "Revenge Trading Urge"]:
            st.error("⚠️ Trading not recommended in current psychological state!")
        else:
            # Calculate PnL for closed trades
            pnl = calculate_pnl(position_size, entry_price, exit_price) if status == "Closed" else 0
            
            # Add trade to dataframe
            new_trade = {
                'date': datetime.now(),
                'symbol': symbol,
                'trade_type': trade_type,
                'entry_price': entry_price,
                'exit_price': exit_price if status == "Closed" else None,
                'stop_loss': stop_loss,
                'target': target_price,
                'position_size': position_size,
                'pnl': pnl,
                'setup_type': setup_type,
                'market_condition': market_condition,
                'psychology': emotion,
                'notes': setup_notes,
                'status': status
            }
            st.session_state.trades = pd.concat([st.session_state.trades, pd.DataFrame([new_trade])], ignore_index=True)
            st.success("Trade logged successfully!")

with tabs[1]:
    st.header("📖 Trade Journal")
    if not st.session_state.trades.empty:
        st.dataframe(st.session_state.trades)
    else:
        st.info("No trades recorded yet. Start by logging your first trade!")

with tabs[2]:
    st.header("📊 Analytics Dashboard")
    if not st.session_state.trades.empty:
        completed_trades = st.session_state.trades[st.session_state.trades['status'] == 'Closed']
        if not completed_trades.empty:
            col1, col2, col3 = st.columns(3)
            
            with col1:
                best_trade = completed_trades['pnl'].max()
                st.metric("Best Trade", f"₹{best_trade:,.2f}")
            with col2:
                worst_trade = completed_trades['pnl'].min()
                st.metric("Worst Trade", f"₹{worst_trade:,.2f}")
            with col3:
                avg_trade = completed_trades['pnl'].mean()
                st.metric("Average Trade", f"₹{avg_trade:,.2f}")
            
            # Setup Performance
            st.subheader("Setup Performance")
            setup_performance = completed_trades.groupby('setup_type')['pnl'].agg(['mean', 'count', 'sum']).round(2)
            st.dataframe(setup_performance)
            
            # Monthly Performance
            st.subheader("Monthly Performance")
            completed_trades['month'] = pd.to_datetime(completed_trades['date']).dt.strftime('%Y-%m')
            monthly_pnl = completed_trades.groupby('month')['pnl'].sum()
            fig_monthly = px.bar(monthly_pnl, title='Monthly P&L')
            st.plotly_chart(fig_monthly)
            
            # Win Rate by Setup
            st.subheader("Win Rate by Setup")
            setup_winrate = completed_trades.groupby('setup_type').apply(
                lambda x: (x['pnl'] > 0).mean() * 100
            ).round(2)
            fig_winrate = px.bar(setup_winrate, title='Win Rate by Setup (%)')
            st.plotly_chart(fig_winrate)
            
            # Trade Distribution
            st.subheader("Trade Type Distribution")
            fig_dist = px.pie(completed_trades, names='trade_type', title='Trade Type Distribution')
            st.plotly_chart(fig_dist)
    else:
        st.info("Start logging trades to see analytics!")

# Footer
st.markdown("---")
st.markdown("Built with ❤️ for traders who take journaling seriously")
