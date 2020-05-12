package edu.amrita.timetable;
import java.util.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.json.simple.JSONArray;
import org.json.simple.JSONValue;

@SuppressWarnings("unused")
public class LoadFromDB 
{
	private static String host="localhost",user="sa",pass="NirU26@^",db="ATMS";
	private static String ConnectionURL="jdbc:sqlserver://"+host+":1433;database="+db+";user="+user+"@mssqldbase;password="+pass+";encrypt=true;trustServerCertificate=true;loginTimeout=30;";
	public static boolean Load()
	{
		try (Connection connection = DriverManager.getConnection(ConnectionURL);) 
		{
			//Faculty and FacultyGroup
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery="select [id] from dbo.Teachers;";
			   ResultSet rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					Integer id=rs.getInt("id");
					MapClass.TeacherList.add(id);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(id);
					MapClass.TeacherMap.put(id,lst);
			   }
			   rs.close();
			   stmt.close();

			   stmt=connection.createStatement();
			   sqlquery="select TeacherID,TeacherGroupID from TeacherGroupMembers;";
			   rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int ID=rs.getInt("TeacherID");
					int GID=rs.getInt("TeacherGroupID");
					if(!MapClass.TeacherMap.containsKey(GID))
					{
						MapClass.TeacherMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.TeacherMap.get(GID).add(ID);
			   }
			   rs.close();
			   stmt.close();
			}

			//Rooms and RoomGroup
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery="select * from Rooms;";
			   ResultSet rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int id=rs.getInt("id");
					int RegionID=rs.getInt("RegionID");
					MapClass.RoomList.add(id);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(id);
					MapClass.RoomMap.put(id,lst);
					MapClass.RoomRegionMap.put(id,RegionID);
			   }
			   rs.close();
			   stmt.close();

			   stmt=connection.createStatement();
			   sqlquery="select * from RoomGroupMembers;";
			   rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int ID=rs.getInt("RoomID");
					int GID=rs.getInt("RoomGroupID");
					if(!MapClass.RoomMap.containsKey(GID))
					{
						MapClass.RoomMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.RoomMap.get(GID).add(MapClass.RoomMap.get(ID).get(0));
			   }

			}

			//TimeSlot and TimeSlotGroup
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery = "select * from TimeSlots;";
			   ResultSet rs = stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					TimeSlot slt = new TimeSlot(),tenSlt =new TimeSlot(),thirtySlt = new TimeSlot();
					slt.id = rs.getInt("TimeSlotID");
					slt.starter = rs.getInt("starter");
					slt.ender = rs.getInt("ender");
					tenSlt.id = 0 - slt.id;
					tenSlt.starter = slt.ender;
					tenSlt.ender = tenSlt.starter + 10;
					thirtySlt.id = (-1) - slt.id;
				    thirtySlt.starter = slt.ender;
				    thirtySlt.ender = thirtySlt.starter + 30;
					if(rs.getBoolean("hasBreak"))
					{
						slt.hasBreak = true;
						slt.startBreak = rs.getInt("startBreak");
						slt.endBreak = rs.getInt("endBreak");
					}
					MapClass.TimeSlotList.add(slt);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(slt.id);
					MapClass.TimeSlotMap.put(slt.id,lst);
					if(rs.getString("description").equals("Lunch"))
                    {
                        MapClass.food = slt;
                    }
                   if(rs.getString("description").equals("LunchCompensation"))
                   {
                       MapClass.foodComp = slt;
                   }
			   }
			   rs.close();
			   stmt.close();

			   stmt=connection.createStatement();
			   sqlquery="select * from TimeSlotGroupMembers;";
			   rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
					int ID=rs.getInt("TimeSlotID");
					int GID=rs.getInt("TimeSlotGroupID");
					if(!MapClass.TimeSlotMap.containsKey(GID))
					{
						MapClass.TimeSlotMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.TimeSlotMap.get(GID).add(ID);
			   }
			   //System.out.println(MapClass.TimeSlotGroup);
			   //System.out.println(MapClass.TimeSlotList);
			}

			//Sections and SectionsGroup
			{
				Statement stmt=connection.createStatement();
				String sqlquery="select * from Sections;";
				ResultSet rs=stmt.executeQuery(sqlquery);
				while (rs.next())
				{
					int id=rs.getInt("id");
					int RegionID=rs.getInt("RegionID");
					MapClass.SectionList.add(id);
					List<Integer> lst=new ArrayList<Integer>();
					lst.add(id);
					MapClass.SectionMap.put(id,lst);
				}
				rs.close();
				stmt.close();

				stmt=connection.createStatement();
				sqlquery="select * from SectionGroupMembers;";
				rs=stmt.executeQuery(sqlquery);
				while (rs.next())
				{
					int ID=rs.getInt("SectionID");
					int GID=rs.getInt("SectionGroupID");
					if(!MapClass.SectionMap.containsKey(GID))
					{
						MapClass.SectionMap.put(GID,new ArrayList<Integer>());
					}
					MapClass.SectionMap.get(GID).add(ID);
				}

			}

			//Lectures
			{
			   Statement stmt=connection.createStatement();
			   String sqlquery="select * from SolutionLectures;";
			   ResultSet rs=stmt.executeQuery(sqlquery);
			   while (rs.next())
			   {
				   try
				   {

					   Lecture lec=new Lecture();
					   int solutionID = rs.getInt("SolutionID");
					   lec.id = rs.getInt("id");
					   lec.TimeSlotSrc = MapClass.TimeSlotMap.get(rs.getInt("TimeSlotSource"));
					   lec.TimeSlotSrcID = rs.getInt("TimeSlotSource");
					   lec.RoomSrc = MapClass.TimeSlotMap.get(rs.getInt("RoomSource"));
                       lec.Teacher = MapClass.TeacherMap.get(rs.getInt("Faculty"));
                       lec.Section = MapClass.SectionMap.get(rs.getInt("SectionID"));
					   // Day Source
					   {
						   Object[] days = ((JSONArray)JSONValue.parse(rs.getString("DaySource"))).toArray();
						   lec.DaySrc = new ArrayList<Integer>();
						   for(int i=0;i!=days.length;i++)
						   {
						   		lec.DaySrc.add((Integer)days[i]);
						   }

					   }
					   if(rs.getObject("Room")!=null)
					   {
							lec.Room =rs.getInt("Room");
					   }
					   if(rs.getObject("TimeSlot")!=null)
					   {
						   lec.TimeSlot =rs.getInt("Room");
					   }
					   if(rs.getObject("Day")!=null)
					   {
						   lec.Day = rs.getInt("Day");
					   }
					   if(!MapClass.SolutionLectureMap.containsKey(solutionID))
					   {
					   		MapClass.SolutionLectureMap.put(solutionID, new ArrayList<Lecture>());
					   }
					   if( lec.DaySrc.size() != 0 && lec.TimeSlotSrc.size()  != 0 && lec.RoomSrc.size() != 0 && lec.Teacher.size() !=0 && lec.Section.size() != 0 )
					       MapClass.SolutionLectureMap.get(solutionID).add(lec);
				   }
				   catch(Exception e)
				   {
						e.printStackTrace();
				   }
			   }
			   rs.close();
			   stmt.close();
			}

		}
		catch (SQLException e) 
		{
			e.printStackTrace();
			return false;
		}
		for(int i=0;i!=MapClass.TimeSlotList.size();i++)
		{
            if(!MapClass.food.doesNotIntersect(MapClass.TimeSlotList.get(i)))
            {
                MapClass.foodConflict.add(i);
            }
            if(!MapClass.foodComp.doesNotIntersect(MapClass.TimeSlotList.get(i)))
            {
                MapClass.foodCompConflict.add(i);
            }
			if(!MapClass.TimeSlotConflict.containsKey(i)) {
				MapClass.TimeSlotConflict.put(i, new TreeSet<Integer>());
			}
            MapClass.TimeSlotConflict.get(i).add(i);
			for(int j=i+1;j!=MapClass.TimeSlotList.size();j++)
			{
				if(!MapClass.TimeSlotConflict.containsKey(j)) {
					MapClass.TimeSlotConflict.put(j, new TreeSet<Integer>());
				}
				if(!MapClass.TimeSlotList.get(i).doesNotIntersect(MapClass.TimeSlotList.get(j)))
				{
					MapClass.TimeSlotConflict.get(i).add(j);
					MapClass.TimeSlotConflict.get(j).add(i);
				}

			}
		}
		System.out.println(MapClass.TimeSlotConflict.toString());
		return true;
	}
	public static void store(Solver s)
	{
		try (Connection connection = DriverManager.getConnection(ConnectionURL)) 
		{
			/*
			connection.setAutoCommit(false);
			Statement stmt=connection.createStatement();
			stmt.executeUpdate("delete from lecturesfinal");
			stmt=connection.createStatement();
			String sqlquery="insert into lecturesfinal(Registration,RoomID,DayListID,TimeSlotID) values ";
			for(int i=0;i!=s.getLeclst().size();i++)
			{
				Lecture e=s.getLeclst().get(i);
				if(i!=0)
					sqlquery+=",";
				sqlquery+="("+e.getRegistration()+","+e.getRoom().getID()+","+e.getWeekday().getID()+","+e.getTimeslot().getID()+")";
			}
			stmt.executeUpdate(sqlquery+";");
			stmt.close();
			connection.commit();
			connection.close();
			*/
        }
        catch (SQLException e) 
		{
		       e.printStackTrace();
		}
	}
}
