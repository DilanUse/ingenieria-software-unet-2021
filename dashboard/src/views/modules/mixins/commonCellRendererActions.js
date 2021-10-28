
export default {
  computed: {
    getClasses() {
      return (pos, color = 'primary') => [
        'h-5', 'w-5', `hover:text-${color}`, 'cursor-pointer',
        pos === 1 ? 'ml-4' : '',
        pos === 1 ? 'mr-2' : '',
        pos > 1 ? 'mx-2' : '',
      ];
    },
  },
};
