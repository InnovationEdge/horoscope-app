"""
Data generator for horoscope predictions and banners
"""
import random
from datetime import datetime, timedelta


class HoroscopeDataGenerator:
    """Generate realistic horoscope content"""

    DAILY_TEMPLATES = {
        'aries': [
            "Today brings powerful energy and new opportunities for {sign}. Your natural leadership will shine through in all endeavors.",
            "The stars align to boost your confidence and drive. Take charge of situations that matter most to you.",
            "Dynamic energy flows through you today. Channel this into creative projects and personal goals.",
            "Your pioneering spirit is highlighted today. Don't hesitate to take the first step toward your dreams.",
            "Bold decisions lead to positive outcomes. Trust your instincts and move forward with courage."
        ],
        'taurus': [
            "Steady progress and practical wisdom guide your day. Focus on building lasting foundations.",
            "Your natural patience will be rewarded today. Take time to enjoy life's simple pleasures.",
            "Material matters improve through your persistent efforts. Stay grounded and methodical.",
            "Comfort and security take priority. Make decisions that support your long-term stability.",
            "Your reliable nature attracts positive partnerships. Nurture relationships that bring mutual benefit."
        ],
        'gemini': [
            "Communication and learning are highlighted today. Share your ideas with enthusiasm.",
            "Intellectual curiosity leads to exciting discoveries. Keep your mind open to new possibilities.",
            "Social connections bring unexpected opportunities. Your wit and charm open many doors.",
            "Versatility is your superpower today. Embrace change and adapt with your natural flexibility.",
            "Mental agility helps you solve complex problems. Trust your quick thinking and intuition."
        ],
        'cancer': [
            "Emotional intelligence guides your interactions today. Trust your feelings and intuitive insights.",
            "Home and family matters bring joy and fulfillment. Create nurturing spaces for yourself and loved ones.",
            "Your caring nature is deeply appreciated by others. Show compassion while protecting your energy.",
            "Memory and tradition play important roles today. Honor your past while building for the future.",
            "Protective instincts are heightened. Use your sensitivity to help those who need support."
        ],
        'leo': [
            "Creative expression and personal magnetism are at their peak. Shine your light brightly today.",
            "Leadership opportunities present themselves naturally. Step into the spotlight with confidence.",
            "Generosity and warmth attract positive attention. Your royal nature inspires others to greatness.",
            "Entertainment and joy are themes today. Bring playfulness and drama to your activities.",
            "Personal pride and self-expression lead to recognition. Don't be afraid to show your talents."
        ],
        'virgo': [
            "Attention to detail and practical service bring rewards. Your methodical approach pays off.",
            "Health and daily routines deserve focus today. Small improvements create significant changes.",
            "Analytical skills help you organize and improve systems. Your efficiency is noticed and valued.",
            "Perfectionism has its place, but don't let it paralyze progress. Aim for excellence, not perfection.",
            "Helpful energy flows through you. Your desire to serve others creates meaningful connections."
        ],
        'libra': [
            "Balance and harmony guide your decisions today. Seek beauty and fairness in all situations.",
            "Partnership energy is strong. Collaborate with others to achieve mutual goals and understanding.",
            "Aesthetic appreciation is heightened. Surround yourself with beauty and artistic inspiration.",
            "Diplomatic skills help resolve conflicts gracefully. Your natural charm smooths difficult situations.",
            "Justice and equality matter deeply to you today. Stand up for what's right with grace and wisdom."
        ],
        'scorpio': [
            "Intensity and transformation are themes today. Embrace deep changes that serve your growth.",
            "Intuitive powers are exceptionally strong. Trust your ability to see beneath surface appearances.",
            "Passionate energy drives your pursuits. Channel this intensity into meaningful projects and relationships.",
            "Secrets and mysteries capture your attention. Your investigative nature uncovers hidden truths.",
            "Regenerative power flows through you. Release what no longer serves and embrace renewal."
        ],
        'sagittarius': [
            "Adventure and expansion call to your spirit today. Explore new horizons with optimism and enthusiasm.",
            "Philosophical insights emerge through experiences. Your search for meaning brings wisdom and growth.",
            "Freedom and independence are essential today. Avoid situations that feel too restrictive or limiting.",
            "Teaching and learning opportunities abound. Share your knowledge while remaining open to new perspectives.",
            "Jovial energy attracts good fortune. Your positive attitude and humor uplift everyone around you."
        ],
        'capricorn': [
            "Ambitious goals and practical achievements are highlighted. Your discipline and persistence pay dividends.",
            "Authority and responsibility sit naturally on your shoulders. Lead with wisdom and integrity.",
            "Long-term planning benefits from your careful consideration. Build structures that will endure.",
            "Professional reputation grows through consistent effort. Your reliability is your greatest asset.",
            "Traditional approaches prove most effective today. Trust in proven methods and established wisdom."
        ],
        'aquarius': [
            "Innovation and humanitarian causes inspire your actions today. Your unique perspective makes a difference.",
            "Friendship and group activities bring unexpected benefits. Connect with like-minded individuals.",
            "Technological solutions appeal to your forward-thinking nature. Embrace modern approaches and methods.",
            "Independence and originality set you apart. Don't conform to expectations that don't serve you.",
            "Visionary thinking helps you see future possibilities. Your insights are ahead of their time."
        ],
        'pisces': [
            "Intuition and compassion guide your interactions today. Trust your psychic impressions and emotional wisdom.",
            "Creative and spiritual pursuits bring deep satisfaction. Allow your imagination to flow freely.",
            "Empathetic connections touch your heart. Your sensitivity is a gift that heals and inspires others.",
            "Dreams and symbolism carry important messages. Pay attention to your subconscious communications.",
            "Gentle strength helps you navigate emotional waters. Your flexibility allows you to adapt and flow."
        ]
    }

    COLORS = [
        "Crimson Red", "Royal Blue", "Emerald Green", "Golden Yellow", "Deep Purple",
        "Silver", "Rose Gold", "Turquoise", "Coral Pink", "Forest Green",
        "Sunset Orange", "Midnight Blue", "Sage Green", "Lavender", "Copper"
    ]

    MOODS = [
        "Confident", "Peaceful", "Energetic", "Romantic", "Focused",
        "Adventurous", "Creative", "Balanced", "Mysterious", "Optimistic",
        "Determined", "Inspiring", "Intuitive", "Playful", "Wise"
    ]

    WEEKLY_MONTHLY_TEMPLATES = {
        'weekly': [
            "This week focuses on building lasting foundations in your personal and professional life. Planetary alignments suggest a time of consolidation and growth, where previous efforts begin to show tangible results. Pay special attention to relationships and communication patterns.",
            "A transformative week ahead brings opportunities for significant personal development. The cosmic energies support breaking free from old patterns and embracing new ways of being. Trust your intuition as it guides you toward positive changes.",
            "Career and financial matters take center stage this week. Strategic thinking and careful planning will serve you well. Collaborative efforts prove especially fruitful, so don't hesitate to reach out to trusted allies.",
            "Emotional healing and spiritual growth are highlighted throughout this week. Take time for self-reflection and inner work. Your sensitivity becomes a source of strength rather than vulnerability.",
            "Creative expression and self-confidence receive cosmic support this week. It's an excellent time to showcase your talents and pursue artistic endeavors. Romance and pleasure activities bring joy and fulfillment."
        ],
        'monthly': [
            "This month marks a significant turning point in your personal evolution. Major planetary transits activate your sector of transformation, bringing opportunities to release old patterns and embrace empowering new directions. The first half focuses on clearing space, while the latter brings fresh beginnings.",
            "Professional recognition and career advancement feature prominently this month. Your dedication and expertise gain visibility, potentially leading to new responsibilities or opportunities. Financial planning and resource management also require attention.",
            "Relationships undergo positive restructuring this month. Whether romantic, friendship, or business partnerships, connections deepen and become more authentic. Communication improves dramatically, leading to greater understanding and harmony.",
            "Health, daily routines, and work-life balance take priority this month. Cosmic influences support establishing sustainable habits that enhance your overall well-being. Pay attention to your body's needs and honor your natural rhythms.",
            "Educational pursuits and spiritual growth are beautifully supported throughout this month. Your mind is particularly receptive to new knowledge and wisdom. Travel, both physical and metaphorical, expands your perspectives significantly."
        ],
        'yearly': [
            "This year represents a complete cycle of growth and achievement in your life journey. The cosmic alignments suggest a year of building upon past experiences while simultaneously breaking new ground. Your ruling planet's aspects indicate opportunities for both material success and spiritual development will emerge consistently throughout the twelve months.",
            "A year of profound transformation awaits, with each season bringing distinct opportunities for growth. Spring focuses on new beginnings and fresh perspectives, summer emphasizes manifestation and abundance, autumn brings harvest and recognition, while winter offers introspection and planning for future endeavors.",
            "Leadership and authority become central themes this year. Whether in professional settings, community involvement, or personal relationships, you're called to step into greater responsibility and influence. Your natural talents receive recognition and support from unexpected sources.",
            "Creative expression and emotional fulfillment take precedence this year. Artistic pursuits flourish, and your unique vision gains appreciation from others. Love relationships deepen, and new romantic connections carry significant meaning and potential for long-term happiness.",
            "This year emphasizes practical achievement and material security. Your methodical approach to goals yields substantial results. Property, investments, and career stability all benefit from your patient, consistent efforts throughout the year."
        ]
    }

    @classmethod
    def generate_daily_prediction(cls, sign, date):
        """Generate a daily prediction for a specific sign and date"""
        templates = cls.DAILY_TEMPLATES.get(sign, cls.DAILY_TEMPLATES['aries'])
        text = random.choice(templates).format(sign=sign.capitalize())

        return {
            'sign': sign,
            'date': date.strftime('%Y-%m-%d'),
            'text': text,
            'lucky_number': random.randint(1, 50),
            'lucky_color': random.choice(cls.COLORS),
            'mood': random.choice(cls.MOODS),
            'aspects': {
                'love': random.randint(60, 100),
                'career': random.randint(60, 100),
                'health': random.randint(60, 100)
            }
        }

    @classmethod
    def generate_extended_prediction(cls, sign, period_type, period_key):
        """Generate weekly, monthly, or yearly predictions"""
        templates = cls.WEEKLY_MONTHLY_TEMPLATES.get(period_type, cls.WEEKLY_MONTHLY_TEMPLATES['weekly'])
        text = random.choice(templates)

        return {
            'sign': sign,
            period_type.replace('ly', ''): period_key,
            'text': text,
            'premium': True
        }

    @classmethod
    def generate_banner_data(cls):
        """Generate banner data"""
        return [
            {
                "id": "premium_weekly",
                "title": "✨ Unlock your Weekly Horoscope",
                "subtitle": "Deeper guidance awaits",
                "bullets": ["See career highlights", "Navigate relationships", "Make smarter moves"],
                "target": "premium",
                "premium_required": True
            },
            {
                "id": "compat_leo",
                "title": "💖 Who's your best match?",
                "subtitle": "Try compatibility with Leo",
                "bullets": ["Instant chemistry score", "Actionable tips"],
                "target": "compat:leo",
                "premium_required": False
            },
            {
                "id": "monthly_upgrade",
                "title": "🌙 Monthly Insights Available",
                "subtitle": "Get {PRICE}/month for complete guidance",
                "bullets": ["Full monthly forecast", "Lucky dates revealed", "Relationship advice"],
                "target": "premium",
                "premium_required": True
            },
            {
                "id": "traits_explore",
                "title": "🔮 Discover Your Traits",
                "subtitle": "Learn what makes you unique",
                "bullets": ["Personality insights", "Strengths & weaknesses", "Element guidance"],
                "target": "traits:aries",
                "premium_required": False
            }
        ]