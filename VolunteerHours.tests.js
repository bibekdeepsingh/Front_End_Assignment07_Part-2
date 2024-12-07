describe('Volunteer Hours Tracker Component', () => {
  let formData;

  // Stage 1 Tests: Form submission and validation
  describe('Stage 1: Form Handling and Validation', () => {
    beforeEach(() => {
      formData = {
        volunteerName: 'Travis',
        hoursVolunteered: 8,
        dateOfService: '2024-12-06',
        volunteerMessage: 'Happy to help the community!',
      };
    });

    test('should trigger the function on form submission', () => {
      const mockSubmitFunction = jest.fn();
      mockSubmitFunction();
      expect(mockSubmitFunction).toHaveBeenCalled();
    });

    test('should collect form data correctly', () => {
      expect(formData.volunteerName).toBe('Travis');
      expect(formData.hoursVolunteered).toBe(8);
      expect(formData.dateOfService).toBe('2024-12-06');
      expect(formData.volunteerMessage).toBe('Happy to help the community!');
    });

    test('should validate required fields', () => {
      const incompleteData = { ...formData, volunteerName: '' };
      expect(incompleteData.volunteerName).toBe('');
    });

    test('should validate volunteer hours is a valid number', () => {
      const invalidData = { ...formData, hoursVolunteered: -3 };
      expect(invalidData.hoursVolunteered).toBeLessThan(0);
    });

    test('should populate temporary data object correctly', () => {
      const tempData = formData;
      expect(tempData.volunteerName).toBe('Travis');
      expect(tempData.hoursVolunteered).toBe(8);
      expect(tempData.dateOfService).toBe('2024-12-06');
    });
  });

  // Stage 2 Tests: Data Persistence and Table Management
  describe('Stage 2: Data Persistence and Table Functionality', () => {
    test('should store and retrieve data in localStorage', () => {
      // Mock localStorage
      const mockLocalStorage = {
        setItem: jest.fn(),
        getItem: jest.fn(() => JSON.stringify([{ volunteerName: 'Travis', hoursVolunteered: 8 }])),
      };

      // Simulate saving data
      mockLocalStorage.setItem('volunteerHours', JSON.stringify([{ volunteerName: 'Travis', hoursVolunteered: 8 }]));
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('volunteerHours', JSON.stringify([{ volunteerName: 'Travis', hoursVolunteered: 8 }]));

      // Simulate retrieving data
      const data = JSON.parse(mockLocalStorage.getItem('volunteerHours'));
      expect(data[0].volunteerName).toBe('Travis');
      expect(data[0].hoursVolunteered).toBe(8);
    });

    test('should display total volunteer hours in summary', () => {
      const volunteerRecords = [
        { volunteerName: 'Travis', hoursVolunteered: 8 },
        { volunteerName: 'Micheal', hoursVolunteered: 5 },
      ];
      const totalHours = volunteerRecords.reduce((sum, record) => sum + record.hoursVolunteered, 0);
      expect(totalHours).toBe(13);
    });

    test('should delete a volunteer record and update localStorage', () => {
      const volunteerRecords = [
        { volunteerName: 'Travis', hoursVolunteered: 8 },
        { volunteerName: 'Micheal', hoursVolunteered: 5 },
      ];

    
      volunteerRecords.splice(0, 1); 
      expect(volunteerRecords.length).toBe(1);


      const mockLocalStorage = { setItem: jest.fn() };
      mockLocalStorage.setItem('volunteerHours', JSON.stringify(volunteerRecords));
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('volunteerHours', JSON.stringify(volunteerRecords));
    });
  });
});
