
# ... keep existing code (imports and initial setup)

# Set page config
st.set_page_config(page_title="Options Trading Journal", layout="wide")

# Initialize session state variables
if 'trades' not in st.session_state:
    st.session_state.trades = pd.DataFrame(columns=[
        'date', 'symbol', 'trade_type', 'entry_price', 'exit_price', 
        'stop_loss', 'target', 'position_size', 'brokerage', 'stt',
        'transaction_charges', 'gst', 'stamp_duty', 'total_charges',
        'net_pnl', 'setup_type', 'market_condition', 'psychology', 
        'notes', 'status'
    ])

def calculate_position_size(capital, risk_percent, entry, stop_loss):
    risk_amount = capital * (risk_percent / 100)
    position_size = risk_amount / abs(entry - stop_loss)
    return round(position_size)

def calculate_pnl(position_size, entry_price, exit_price):
    return position_size * (exit_price - entry_price)

def calculate_charges(position_size, entry_price, exit_price, trade_type):
    # Calculate turnover
    turnover = position_size * (entry_price + exit_price)
    
    # Brokerage (example: 0.03% or minimum ₹20 per order)
    brokerage = min(turnover * 0.0003, 40)  # For both buy and sell combined
    
    # Securities Transaction Tax (STT)
    if trade_type in ["Call Option", "Put Option"]:
        stt = (position_size * exit_price) * 0.0005  # 0.05% on sell side for options
    else:
        stt = turnover * 0.0001  # 0.01% for equity delivery

    # Exchange Transaction Charges (0.00325%)
    transaction_charges = turnover * 0.0000325
    
    # GST (18% on brokerage and transaction charges)
    gst = (brokerage + transaction_charges) * 0.18
    
    # Stamp Duty (0.003% on buy side)
    stamp_duty = (position_size * entry_price) * 0.00003
    
    # Calculate total charges
    total_charges = brokerage + stt + transaction_charges + gst + stamp_duty
    
    return {
        'brokerage': round(brokerage, 2),
        'stt': round(stt, 2),
        'transaction_charges': round(transaction_charges, 2),
        'gst': round(gst, 2),
        'stamp_duty': round(stamp_duty, 2),
        'total_charges': round(total_charges, 2)
    }

# ... keep existing code (Header and Sidebar sections)

with tabs[0]:
    st.header("📝 Trade Entry Form")
    
    # ... keep existing code (col1 section)

    with col2:
        # ... keep existing code (existing Trade Details)
        
        # Show charges calculation for closed trades
        if status == "Closed" and entry_price and exit_price and position_size:
            st.subheader("Charges Breakdown")
            charges = calculate_charges(position_size, entry_price, exit_price, trade_type)
            
            charges_col1, charges_col2 = st.columns(2)
            with charges_col1:
                st.metric("Brokerage", f"₹{charges['brokerage']:,.2f}")
                st.metric("STT", f"₹{charges['stt']:,.2f}")
                st.metric("Transaction Charges", f"₹{charges['transaction_charges']:,.2f}")
            with charges_col2:
                st.metric("GST", f"₹{charges['gst']:,.2f}")
                st.metric("Stamp Duty", f"₹{charges['stamp_duty']:,.2f}")
                st.metric("Total Charges", f"₹{charges['total_charges']:,.2f}")

    # ... keep existing code (Trade Notes section)

    # Submit button
    if st.button("Log Trade"):
        if emotion in ["FOMO", "Revenge Trading Urge"]:
            st.error("⚠️ Trading not recommended in current psychological state!")
        else:
            # Calculate PnL and charges for closed trades
            pnl = calculate_pnl(position_size, entry_price, exit_price) if status == "Closed" else 0
            charges = calculate_charges(position_size, entry_price, exit_price, trade_type) if status == "Closed" else {
                'brokerage': 0, 'stt': 0, 'transaction_charges': 0, 'gst': 0, 'stamp_duty': 0, 'total_charges': 0
            }
            net_pnl = pnl - charges['total_charges'] if status == "Closed" else 0
            
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
                'brokerage': charges['brokerage'],
                'stt': charges['stt'],
                'transaction_charges': charges['transaction_charges'],
                'gst': charges['gst'],
                'stamp_duty': charges['stamp_duty'],
                'total_charges': charges['total_charges'],
                'pnl': pnl,
                'net_pnl': net_pnl,
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
        # Add column configuration to show/hide specific columns
        column_config = {
            'date': 'Date',
            'symbol': 'Symbol',
            'trade_type': 'Type',
            'entry_price': 'Entry',
            'exit_price': 'Exit',
            'position_size': 'Size',
            'total_charges': 'Charges',
            'pnl': 'Gross P&L',
            'net_pnl': 'Net P&L',
            'status': 'Status'
        }
        st.dataframe(
            st.session_state.trades,
            column_config=column_config,
            hide_index=True
        )
    else:
        st.info("No trades recorded yet. Start by logging your first trade!")

with tabs[2]:
    st.header("📊 Analytics Dashboard")
    if not st.session_state.trades.empty:
        completed_trades = st.session_state.trades[st.session_state.trades['status'] == 'Closed']
        if not completed_trades.empty:
            col1, col2, col3 = st.columns(3)
            
            with col1:
                best_trade = completed_trades['net_pnl'].max()
                st.metric("Best Trade (Net)", f"₹{best_trade:,.2f}")
            with col2:
                worst_trade = completed_trades['net_pnl'].min()
                st.metric("Worst Trade (Net)", f"₹{worst_trade:,.2f}")
            with col3:
                avg_trade = completed_trades['net_pnl'].mean()
                st.metric("Average Trade (Net)", f"₹{avg_trade:,.2f}")
            
            # Charges Analysis
            st.subheader("Trading Costs Analysis")
            total_charges = completed_trades[['brokerage', 'stt', 'transaction_charges', 'gst', 'stamp_duty']].sum()
            fig_charges = px.pie(
                values=total_charges.values,
                names=total_charges.index,
                title='Trading Costs Breakdown'
            )
            st.plotly_chart(fig_charges)
            
            # Cost Metrics
            cost_col1, cost_col2 = st.columns(2)
            with cost_col1:
                total_turnover = (completed_trades['position_size'] * 
                                (completed_trades['entry_price'] + completed_trades['exit_price'])).sum()
                st.metric("Total Turnover", f"₹{total_turnover:,.2f}")
                st.metric("Total Charges", f"₹{completed_trades['total_charges'].sum():,.2f}")
            with cost_col2:
                cost_percentage = (completed_trades['total_charges'].sum() / total_turnover * 100) if total_turnover > 0 else 0
                st.metric("Cost %", f"{cost_percentage:.2f}%")
                st.metric("Net P&L", f"₹{completed_trades['net_pnl'].sum():,.2f}")

            # ... keep existing code (other analytics sections)

# ... keep existing code (Footer section)
