"""
Compatibility data generator for zodiac signs
"""
import random


class CompatibilityDataGenerator:
    """Generate realistic compatibility content between zodiac signs"""

    # Element compatibilities (higher scores for compatible elements)
    ELEMENT_MAP = {
        'aries': 'fire',
        'leo': 'fire',
        'sagittarius': 'fire',
        'taurus': 'earth',
        'virgo': 'earth',
        'capricorn': 'earth',
        'gemini': 'air',
        'libra': 'air',
        'aquarius': 'air',
        'cancer': 'water',
        'scorpio': 'water',
        'pisces': 'water'
    }

    ELEMENT_COMPATIBILITY = {
        ('fire', 'fire'): (85, 95),
        ('fire', 'air'): (80, 90),
        ('fire', 'earth'): (50, 70),
        ('fire', 'water'): (40, 60),
        ('earth', 'earth'): (80, 90),
        ('earth', 'water'): (75, 85),
        ('earth', 'air'): (45, 65),
        ('air', 'air'): (85, 95),
        ('air', 'water'): (50, 70),
        ('water', 'water'): (80, 90),
    }

    PREVIEW_TEMPLATES = {
        ('fire', 'fire'): [
            "A passionate and dynamic pairing with intense chemistry.",
            "Both share a love for adventure and excitement.",
            "High energy relationship with mutual understanding.",
            "Natural leadership qualities complement each other well.",
            "Spontaneous and energetic partnership with great potential."
        ],
        ('fire', 'air'): [
            "Fire and air create a stimulating and inspiring connection.",
            "Intellectual conversations fuel the passionate fire nature.",
            "Air feeds the fire, creating growth and excitement.",
            "Great balance between action and ideas.",
            "Dynamic partnership with excellent communication."
        ],
        ('fire', 'earth'): [
            "Fire brings excitement while earth provides stability.",
            "Different approaches that can complement or clash.",
            "Earth grounds the fire's impulsiveness with practical wisdom.",
            "Potential for growth if both respect their differences.",
            "Challenging but potentially rewarding combination."
        ],
        ('fire', 'water'): [
            "Steam forms when fire meets water - intense but complicated.",
            "Emotional depth meets passionate energy in complex ways.",
            "Water can either nurture or extinguish the fire's enthusiasm.",
            "Requires patience and understanding from both sides.",
            "Transformative potential with careful emotional navigation."
        ],
        ('earth', 'earth'): [
            "Solid, reliable partnership built on shared values.",
            "Mutual appreciation for stability and security.",
            "Practical approach to life creates lasting bonds.",
            "Strong foundation for long-term commitment.",
            "Steady growth and dependable emotional support."
        ],
        ('earth', 'water'): [
            "Nurturing water helps earth's growth and development.",
            "Emotional depth combines beautifully with practical stability.",
            "Water brings intuition while earth provides grounding.",
            "Natural harmony and mutual support.",
            "Gentle, caring relationship with deep emotional bonds."
        ],
        ('earth', 'air'): [
            "Air brings new ideas while earth provides practical application.",
            "Different communication styles require patience.",
            "Earth's stability can feel limiting to free-flowing air.",
            "Growth possible through mutual respect and understanding.",
            "Challenging but intellectually stimulating combination."
        ],
        ('air', 'air'): [
            "Intellectually stimulating with excellent communication.",
            "Shared love for ideas, conversation, and mental connection.",
            "Freedom and independence respected by both partners.",
            "Social and outgoing partnership with many shared interests.",
            "Light, breezy relationship with intellectual depth."
        ],
        ('air', 'water'): [
            "Air's rationality meets water's emotional intuition.",
            "Different approaches to processing life experiences.",
            "Water's depth can feel overwhelming to logical air.",
            "Potential for beautiful balance with mutual understanding.",
            "Requires emotional intelligence and clear communication."
        ],
        ('water', 'water'): [
            "Deep emotional connection with intuitive understanding.",
            "Psychic-like communication and empathetic bond.",
            "Shared appreciation for emotional depth and sensitivity.",
            "Nurturing, supportive relationship with strong intimacy.",
            "Flow together naturally with profound emotional harmony."
        ]
    }

    PREMIUM_TEMPLATES = {
        ('fire', 'fire'): [
            "For {sign_a} and {sign_b}, 2025 brings an intensely passionate period where both your fiery natures will ignite powerful transformations. Your shared love for adventure and spontaneity creates endless possibilities for growth and excitement. However, be mindful that two strong flames can sometimes compete for oxygen. The key to your success lies in channeling your combined energy toward shared goals rather than individual conquests. In love, expect fireworks but also learn to appreciate quiet moments together. Career collaborations prove especially fruitful during spring months, while summer brings opportunities for travel and expansion. Remember that your mutual independence is a strength, not a threat to your connection. Practice patience during Mercury retrograde periods when communication may spark unnecessary conflicts.",
            "The cosmic alignment of {sign_a} and {sign_b} in 2025 reveals a relationship built on mutual respect for each other's leadership qualities and pioneering spirit. Your shared fire element creates natural harmony, but also potential for dramatic moments when your strong wills clash. This year emphasizes learning to lead together rather than competing for dominance. Your relationship thrives on excitement and new experiences, making this an excellent time for adventures, creative projects, and bold life changes. Financial partnerships show particular promise, as your combined courage attracts abundance. The challenge lies in balancing your individual needs for recognition with your commitment to the partnership. Late autumn brings a significant opportunity to demonstrate your loyalty and support for each other's dreams."
        ],
        ('fire', 'air'): [
            "The dynamic between {sign_a} and {sign_b} in 2025 represents one of the most stimulating and growth-oriented partnerships in astrology. Air feeds fire, meaning your air sign partner's ideas, communication skills, and intellectual curiosity will consistently inspire and energize your fiery nature. This year brings numerous opportunities for learning and expansion through your connection. Your fire provides the motivation and courage to act on the brilliant ideas your air partner generates. Together, you create a perfect balance of inspiration and action. Communication flows effortlessly between you, with conversations that spark new possibilities and adventures. This partnership excels in creative endeavors, business ventures, and social situations. The key to maintaining harmony lies in respecting each other's need for freedom and space to grow.",
            "For {sign_a} and {sign_b}, 2025 marks a year of intellectual and emotional elevation through your partnership. The fire-air combination creates natural chemistry where thoughts become actions and dreams transform into reality. Your air partner brings perspective and objectivity to your passionate fire nature, while you provide the drive and determination to manifest their innovative visions. This year particularly favors communication-based projects, teaching opportunities, and social networking that advances both your goals. Travel features prominently in your relationship story, with journeys that expand your perspectives and strengthen your bond. However, be aware that air can sometimes scatter fire's focused energy, so maintain clear priorities and shared objectives to maximize your potential together."
        ],
        ('earth', 'water'): [
            "The beautiful synergy between {sign_a} and {sign_b} in 2025 creates one of nature's most nurturing and sustainable partnerships. Water nourishes earth, allowing for steady, organic growth in all areas of your relationship. Your earth sign's practical stability provides the perfect container for your water partner's emotional depth and intuitive wisdom. This year emphasizes building something lasting together, whether that's a home, family, business, or creative project. Your combined energies excel at creating beauty, comfort, and security. The water partner's emotional intelligence complements the earth partner's practical problem-solving abilities perfectly. This relationship deepens gradually but profoundly, with each season bringing new layers of understanding and appreciation. Trust develops naturally as both partners prove their reliability and devotion through consistent actions rather than grand gestures.",
            "In 2025, the {sign_a} and {sign_b} partnership demonstrates the power of complementary strengths working in harmony. Earth provides the stable foundation while water offers emotional nourishment and intuitive guidance. This combination excels at creating abundance through patience, persistence, and careful cultivation of resources. Your relationship serves as a sanctuary where both partners can be authentically themselves without judgment or pressure to change. This year brings opportunities to establish traditions, invest in your future together, and create lasting value through your combined efforts. The earth partner learns to trust emotional intelligence, while the water partner gains confidence through practical achievement. Health and wellness initiatives undertaken together show remarkable success, as do investments in property or long-term financial security."
        ]
    }

    @classmethod
    def get_element_pair(cls, sign_a, sign_b):
        """Get the element pair for two signs"""
        element_a = cls.ELEMENT_MAP[sign_a]
        element_b = cls.ELEMENT_MAP[sign_b]

        # Normalize order for consistency
        if (element_a, element_b) in cls.ELEMENT_COMPATIBILITY:
            return (element_a, element_b)
        else:
            return (element_b, element_a)

    @classmethod
    def generate_compatibility(cls, sign_a, sign_b):
        """Generate compatibility data between two signs"""
        element_pair = cls.get_element_pair(sign_a, sign_b)

        # Get base compatibility range
        score_range = cls.ELEMENT_COMPATIBILITY.get(element_pair, (50, 70))
        overall_score = random.randint(score_range[0], score_range[1])

        # Generate category scores with some variation
        love_score = max(0, min(100, overall_score + random.randint(-15, 15)))
        career_score = max(0, min(100, overall_score + random.randint(-10, 10)))
        friendship_score = max(0, min(100, overall_score + random.randint(-10, 10)))

        # Get preview text
        preview_templates = cls.PREVIEW_TEMPLATES.get(element_pair, cls.PREVIEW_TEMPLATES[('fire', 'fire')])
        preview_text = random.choice(preview_templates)

        # Get premium text
        premium_templates = cls.PREMIUM_TEMPLATES.get(element_pair, cls.PREMIUM_TEMPLATES[('fire', 'fire')])
        premium_text = random.choice(premium_templates).format(
            sign_a=sign_a.capitalize(),
            sign_b=sign_b.capitalize()
        )

        return {
            'signA': sign_a,
            'signB': sign_b,
            'overall': overall_score,
            'categories': {
                'love': love_score,
                'career': career_score,
                'friendship': friendship_score
            },
            'preview': preview_text,
            'premium_text': premium_text
        }