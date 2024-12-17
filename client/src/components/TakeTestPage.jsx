import { useState } from "react";
import CATEGORYtest from './CATEGORY-Test';
import FITBtest from './FITB-Test';
import PARAtest from './PARA-Test';
const TakeTestPage = () => {
    // State to track the current selected Test
    const [currentTest, setCurrentTest] = useState(null);
  
    // Navbar component
    const Navbar = () => {
      const navItems = [
        { 
          id: 'categorization', 
          name: 'Categorization Test',
          description: 'Sort items into the right categories'
        },
        { 
          id: 'fillblank', 
          name: 'Fill in the Blank',
          description: 'Complete sentences by dragging words'
        },
        { 
          id: 'reading', 
          name: 'Reading Comprehension',
          description: 'Answer questions based on a passage'
        }
      ];
  
      return (
        <nav className="bg-blue-600 text-white">
          <div className="container mx-auto px-4 py-4">
            
            <div className="sm:flex justify-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentTest(item.id)}
                  className={`
                    px-4 py-2 rounded transition duration-300
                    ${currentTest === item.id 
                      ? 'bg-blue-800' 
                      : 'hover:bg-blue-700 bg-blue-600'}
                  `}
                >
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-xs text-blue-200">{item.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </nav>
      );
    };
  
    // Render the selected Test or home view
    const renderTest = () => {
      switch(currentTest) {
        case 'categorization':
          return <CATEGORYtest />;
        case 'fillblank':
          return <FITBtest />;
        case 'reading':
          return <PARAtest />;
        default:
          return <CATEGORYtest />;
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {renderTest()}
        </main>
        
          
        
      </div>
    );
  };
  

export default TakeTestPage