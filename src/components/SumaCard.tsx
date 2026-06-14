import React from 'react';
import type { FinCategory } from '../types';
import '../PDetStyle.css';

interface SumaCardProps {
    categories: FinCategory[];
}

const parseAmount = (s: string): number => {
    const n = parseFloat(s.replace(',', '.').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
};

const formatAmount = (n: number): string =>
    n % 1 === 0 ? `${n} zł` : `${n.toFixed(2)} zł`;

const SumaCard: React.FC<SumaCardProps> = ({ categories }) => {
    const catSums = categories.map(cat => ({
        name: cat.name,
        sum: (cat.items || []).reduce((acc, item) => acc + parseAmount(item.amount), 0)
    }));

    const total = catSums.reduce((acc, c) => acc + c.sum, 0);

    return (
        <div className="detail-card detail-card--auto">
            {/* Tytuł + łączna suma w jednej linii */}
            <div className="suma-title-row">
                <h2 className="card-title" style={{ margin: 0, border: 'none', flex: 1 }}>Suma</h2>
                <span className="suma-total">{formatAmount(total)}</span>
            </div>
            <div className="suma-divider" />

            {/* Lista kategorii z sumami */}
            <div className="activity-list suma-list">
                {catSums.length === 0 ? (
                    <p style={{ color: '#aaa', fontStyle: 'italic', lineHeight: '32px' }}>Brak kategorii</p>
                ) : (
                    catSums.map((c, i) => (
                        <div key={i} className="suma-row">
                            <span className="suma-cat-name">{c.name}</span>
                            <span className="suma-cat-amount">{formatAmount(c.sum)}</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SumaCard;
